import {ResponseMessage} from "../utils/responseMessage.util";
import {StatusCodes} from "http-status-codes";
import catchError from "http-errors";
import {Token} from "../generated/prisma/client";
import {prisma} from "../db/db";
import {TokenQueryCondition} from "../utils/TokenQueryCondition";

class TokenModel{
    async createToken(token: Token){
        //----> Insert the token into db.
        await prisma.token.create({
            data: token
        })

        //----> Send back the response.
        return new ResponseMessage("Token has been created successfully!", "success", StatusCodes.CREATED);
    }

    async deleteInvalidTokensByUserId(userId: string){
        //----> Retrieve invalid tokens by user id.
        const queryCondition: TokenQueryCondition = {
            userId,
            expired: true,
            revoked: true
        };

        //----> Delete all invalid tokens by user id.
        return await this.deletedTokensByQuery(queryCondition);
    }

    async deleteAllInvalidTokens(){
        //----> Retrieve all invalid tokens.
        const queryCondition: TokenQueryCondition = {
            expired: true,
            revoked: true
        };

        //----> Delete all invalid tokens.
        return await this.deletedTokensByQuery(queryCondition);
    }

    async findTokenByAccessToken(accessToken: string){
        //----> Fetch the token object with the given access-token.
        return await this.getOneToken(accessToken);
    }

    async findAllValidTokensByUserId(userId: string){
        //----> Retrieve all valid tokens.
        const queryCondition : TokenQueryCondition = {
            userId,
            revoked:false,
            expired:false
        }

        //----> Send back valid tokens.
        return this.findInvalidOrValidTokens(queryCondition);
    }

    async revokedTokensByUserId(userId: string){
        //----> Retrieve all valid tokens.
        const validTokens = await this.findAllValidTokensByUserId(userId);

        //----> invalidate tokens and save them in the db.
        return this.invalidateTokensAndSave(validTokens as Token[] );
    }


    private async deletedTokensByQuery(queryCondition: TokenQueryCondition) {
        const invalidTokens = this.findInvalidOrValidTokens(queryCondition);

        //----> Collect all invalid tokens id in an array.
        const invalidTokenIds = (await invalidTokens).map(token => token.id);

        //----> Delete all in valid tokens.
        const batchDeletedTokens = await prisma.token.deleteMany({
            where: {
                id: {
                    in: invalidTokenIds
                }
            }
        });

        //----> Check for empty counts.
        if (!batchDeletedTokens.count) {
            throw catchError(StatusCodes.NOT_FOUND, "No invalid tokens to delete!");
        }

        //----> Send back response.
        return new ResponseMessage("All invalid tokens have been deleted!", "success", StatusCodes.OK);
    }

    private getOneToken = async(accessToken: string) => {
        //----> Fetch the token object with the given access-token.
        const token = await prisma.token.findUnique({where:{accessToken}});

        //----> Check for empty token.
        if (!token) {
            throw catchError(StatusCodes.NOT_FOUND, "Token not available!");
        }

        //----> Send back response.
        return token;
    }

    private findInvalidOrValidTokens = async(queryCondition: TokenQueryCondition) => {
        //----> Retrieve valid or invalid tokens.
        return prisma.token.findMany({where: queryCondition, select: {
            id: true,
            accessToken: true,
                refreshToken: true,
                expired: true,
                revoked: true,
                tokenType: true,
                userId: true
            },});
    }

    private invalidateTokensAndSave = async(tokens : Token[]) => {
        //----> Invalidate tokens and save them in the db.
        const invalidatedTokens = tokens.map(async token => {
            token.expired = true;
            token.revoked = true;
            return prisma.token.update({
                where: {id : token.id},
                data: {...token}
            })
        });

        //----> Send back response.
        return Promise.all(invalidatedTokens);
    }
}

export const tokenModel = new TokenModel();