import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest, HTTPMethods, RegisterOptions } from "fastify";

type FastifyNext = (err?: Error) => void;

interface IFastifyRouteDepends {
    fastify: FastifyInstance;
}

export type TRouteFunction = (fastify: FastifyInstance, _opts: FastifyPluginOptions, _next: FastifyNext) => void | Promise<void>;

export function FastifyRoute(depends: IFastifyRouteDepends, handler: TRouteFunction, options: RegisterOptions) {
    const { fastify } = depends;
    fastify.register(
        (fastify: FastifyInstance, _opts: FastifyPluginOptions, _next: FastifyNext) => handler(fastify, _opts, _next),
        options
    );
}