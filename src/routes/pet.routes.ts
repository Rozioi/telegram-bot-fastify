import { FastifyRequestType } from "fastify/types/type-provider";
import { PetService } from "../services/pet.service";
import { TRouteFunction } from "../utils/fastify-route";
import { FastifyRequest } from "fastify";

export const PetRoutes: TRouteFunction = (fastify, _opts, done) => {
    fastify.get('/user/:userId', async (req: FastifyRequest<{ Params: {userId: number}}>,reply) => {
        const {userId} = req.params;
        if (Number.isNaN(parseInt(userId as any))) reply.status(400).send("user_id is not valid");
        try{
            const pet = await PetService.GetPetByUserId(userId);
            if (!pet){
                reply.status(404).send({message: "У данного пользователя нету питомца"})
            }
            console.log(pet);
            reply.send(pet);
        } catch(err){
            reply.status(500).send(`Произошла ошибка на сервере` )
        }
    });

    done();

} 