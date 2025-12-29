import {
    ChangeUserPassword,
    ChangeUserRole,
    EditUserProfile,
    LoginUser,
    SignupUser
} from "../validations/auth.validation";
import * as bcrypt from "bcryptjs";
import {StatusCodes} from "http-status-codes";
import catchError from "http-errors";
import {prisma} from "../db/db";
import {Role, Token, TokenType} from "../generated/prisma/client";
import {ResponseMessage} from "../utils/responseMessage.util";
import {TokenJwt} from "../utils/tokenJwt.util";
import {Request, Response} from "express";
import * as jwt from "jsonwebtoken";
import {tokenModel} from "./token.model";
import {CookieParam} from "../utils/CookieParam.util";
import {fromSignupToUser} from "../utils/fromSignupToUser.util";
import {UserSession} from "../types/express";
import {toUserDto} from "../dto/user.dto"

class AuthModel {
    async changeUserPassword(changePassword: ChangeUserPassword) {
       console.log("In changeUserPassword, payload : ", changePassword);
        //----> Destructure the changePassword object
       const {email, confirmPassword, password, newPassword} = changePassword;

       //----> Check for match password.
        if (!this.checkForMatchPassword(newPassword, confirmPassword)) {
            throw catchError(StatusCodes.BAD_REQUEST, "Passwords do not match");
        }

        //----> Check for null user.
        const user = await this.getUserByEmail(email);
        //----> Validate password.
        if(!await this.validatePassword(password, user.password)){
            throw catchError(StatusCodes.UNAUTHORIZED, "Invalid credentials!");
        }

        //----> Hash the new password.
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        //----> Update the user password.
        await prisma.user.update({ where: { id: user.id }, data: { ...user, password: hashedPassword }});

        //----> Send back feedback.
        return new ResponseMessage("Password changed successfully!", "success", StatusCodes.OK)

    }

    async changeUserRole(changeRole: ChangeUserRole) {
        //----> Destructure the changeRole object
        const {email, role} = changeRole;

        //----> Check for null user.
        const userToChangeRole = await this.getUserByEmail(email);

        //----> Save the user role.
        await prisma.user.update({ where: { id: userToChangeRole.id }, data: { ...userToChangeRole, role }});

        //----> Send back feedback.
        return new ResponseMessage("User role is changed successfully!", "success", StatusCodes.OK)

    }

    async editUserProfile(editProfile: EditUserProfile) {
        //----> Destructure the editProfile object
        const {email, password} = editProfile;

        //----> Check for null user.
        const userToEditProfile = await this.getUserByEmail(email);

        //----> Validate password.
        if (! await this.validatePassword(password, userToEditProfile.password)){
            throw catchError(StatusCodes.UNAUTHORIZED, "Invalid credentials!");
        }

        //----> Update the user profile.
        await prisma.user.update({ where: { email }, data: { ...editProfile, role: userToEditProfile.role, password: userToEditProfile.password }});

        //----> Send back feedback.
        return new ResponseMessage("User profile is edited successfully!", "success", StatusCodes.OK)

    }

    async getCurrentUser(email: string ){
       const user = await this.getUserByEmail(email);
       return toUserDto(user);
    }

    async loginUser(loginUser: LoginUser, res: Response) {
        //----> Destructure the loginUser object
        const {email, password} = loginUser;

        //----> Check for null user.
        const user = await this.getUserByEmail(email);

        //----> Validate password.
        if(!await this.validatePassword(password, user.password)){
            throw catchError(StatusCodes.UNAUTHORIZED, "Invalid credentials!");
        }

        //----> generate tokens, sessions and set them in cookies.
        const tokenJwt: TokenJwt = { id: user.id,name: user.name,email:user.email, role: user.role as Role}
        return this.generateTokensAndSetCookies(tokenJwt, res)
    }
    async logoutUser(req: Request, res: Response) {
        // //----> Get session object and revoked valid token object.
        // const session = this.getSession(req);
        // await tokenModel.revokedTokensByUserId(session.id);
        const sessionString = req.cookies[CookieParam.sessionName];

        //----> Check for undefined session-string.
        if (!sessionString) {
            throw catchError(StatusCodes.UNAUTHORIZED, "You have already logged out!");
        }

        //----> Parse the session object.
        const session = JSON.parse(sessionString) as UserSession;

        //----> Check for null session.
        if (!session) {
            throw catchError(StatusCodes.UNAUTHORIZED, "You have already logged out!");
        }

        //----> Invalidate last valid token object.
        await tokenModel.revokedTokensByUserId(session.id);

        //----> Delete accessToken, refreshToken and session from cookies.
        this.deleteCookie(res, CookieParam.accessTokenName, CookieParam.accessTokenPath);
        this.deleteCookie(res, CookieParam.refreshTokenName, CookieParam.refreshTokenPath);
        this.deleteCookie(res, CookieParam.sessionName, CookieParam.sessionPath);

        //----> Send back feedback.
        return new ResponseMessage("User logged out successfully!", "success", StatusCodes.OK)
    }
    async refreshUserToken(req: Request, res: Response) {
        //----> Retrieve refreshToken from cookies.
        const refreshToken = this.getRefreshToken(req);

        //----> Validate refresh token.
        const tokenJwt = this.validateUserToken(refreshToken);

        //----> generate tokens, sessions and set them in cookies.
        return this.generateTokensAndSetCookies(tokenJwt, res)
    }

    async signupUser(signup: SignupUser) {
        //----> Destructure the signup object
        const {email, password, confirmPassword} = signup;

        //----> Check for password match.
        if (this.checkForMatchPassword(password, confirmPassword)) {
            throw catchError(StatusCodes.BAD_REQUEST, "Passwords do not match!");
        }

        //----> Check for existing user.
        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            throw catchError(StatusCodes.UNAUTHORIZED, "Invalid credentials!");
        }

        //----> Hash the password.
        signup.password = await bcrypt.hash(password, 12);

        //----> make a new user.
        const user = fromSignupToUser(signup);
        const newUser = await prisma.user.create({ data: {...user}});

        //----> Send back feedback.
        return new ResponseMessage("User signed up successfully!", "success", StatusCodes.CREATED)
    }

    validateUserToken(token: string){
        //----> Check for empty token.
        if(!token) {
            throw catchError(
                StatusCodes.UNAUTHORIZED,
                "Invalid credentials!"
            );
        }

        //----> Verify the jwt-token
        try {
            return jwt?.verify(token, process.env.JWT_TOKEN_KEY!) as TokenJwt;
        }catch(err) {
            throw catchError(StatusCodes.UNAUTHORIZED, "Invalid credentials!");
        }

    }

    getToken(cookieName: string, req: Request){
        const token = req.cookies[cookieName] as string;
        //----> Check for null accessToken.
        if (!token) {
            throw catchError(StatusCodes.UNAUTHORIZED, "You are not logged in!");
        }

        //----> Return accessToken.
        return token;
    }

    getRefreshToken(req: Request){
        return this.getToken(CookieParam.refreshTokenName, req);
    }

    getSession(req: Request){
        //----> Retrieve the accessToken from the cookie.
        const accessToken = authModel.getAccessToken(req);

        //----> Check for null accessToken.
        if (!accessToken) {
            throw catchError(StatusCodes.UNAUTHORIZED, "You are not logged in, please login!");
        }

        //----> Validate accessToken.
        const tokenJwt = this.validateUserToken(accessToken);
        req.user = tokenJwt;

        //----> Create a session object and return it.
        return this.makeSession(tokenJwt, accessToken);
    }

    private checkForMatchPassword(passwordOne: string, passwordTwo: string) {
        return passwordOne === passwordTwo;
    }

    private async validatePassword(rawPassword: string, encodedPassword: string) {
        return bcrypt.compare(rawPassword, encodedPassword);
    }

    private async getUserByEmail(email: string) {
        const user = await prisma.user.findUnique({ where: { email }});

        //----> Check for null user.
        if (!user){
            throw catchError(StatusCodes.UNAUTHORIZED, "Invalid credentials!");
        }

        //----> Return user.
        return user;
    }

    private async generateTokensAndSetCookies(user: TokenJwt, res: Response) {
        //----> Invalidate last valid token object.
        await tokenModel.revokedTokensByUserId(user.id);

        //----> Generate access-token and store it in a cookie.
        const accessToken = await this.generateToken(user.id, user.name, user.email, user.role, CookieParam.accessTokenExpiresIn);
        this.setCookie(res, accessToken, CookieParam.accessTokenName, CookieParam.accessTokenPath, CookieParam.accessTokenMaxAge);

        //----> Generate refresh-token and store it in a cookie.
        const refreshToken = await this.generateToken(user.id, user.name, user.email, user.role, CookieParam.refreshTokenExpiresIn);
        this.setCookie(res, refreshToken, CookieParam.refreshTokenName, CookieParam.refreshTokenPath, CookieParam.refreshTokenMaxAge);

        //----> Set a session object in the response.
        this.setSession(user, res);

        //----> Make a token object and store it in the db.

        const token = this.makeNewToken(accessToken, refreshToken, user.id);
        await tokenModel.createToken(token);

        //----> Return the session object.
        return this.makeSession(user, accessToken);

    }

    private setCookie(res: Response, token: string, cookieName: string, cookiePath: string, cookieMaxAge: number) {
        res.cookie(cookieName, token, {
            httpOnly: true,
            path: cookiePath,
            maxAge: cookieMaxAge,
            secure: process.env.NODE_ENV === "production",
        });
    }

    private generateToken = async (id: string, name: string, email: string, role: Role, expiresIn: number)=>{
        return jwt.sign(
            {
                id,
                name,
                role,
                email
            },
            process.env.JWT_TOKEN_KEY!,
            {expiresIn}
        );
    }

    private deleteCookie (res: Response, cookieName: string, cookiePath: string)  {
        res.clearCookie(cookieName, { path: cookiePath, secure: false, httpOnly: true });
    }

    private makeNewToken(accessToken: string, refreshToken: string, userId: string): Token{
        return {
            id: undefined,
            accessToken,
            refreshToken,
            expired: false,
            revoked: false,
            tokenType: TokenType.Bearer,
            userId,
            createdAt: undefined,
            updatedAt: undefined,
        }
    }

    private makeSession(user: TokenJwt, accessToken: string) : UserSession{
        const isLoggedIn = !!user && !!accessToken;
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessToken,
            isLoggedIn,
            isAdmin: user.role === Role.Admin,
        }
    }

    private getAccessToken(req: Request): string {
        //----> Retrieve the accessToken from the cookie.
        return this.getToken(CookieParam.accessTokenName, req);
    }

    private setSession(tokenJwt: TokenJwt, res: Response) {
        //----> Make a session object.
        const session = this.makeSession(tokenJwt, "");

        //----> Set the session cookie.
        this.setCookie(res, JSON.stringify(session), CookieParam.sessionName, CookieParam.sessionPath, CookieParam.sessionMaxAge);
    }
}

export const authModel = new AuthModel();