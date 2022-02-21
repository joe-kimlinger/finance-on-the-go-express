import { getRepository } from "typeorm";
import { User } from "../models";

export interface IUserPayload {
    firstName: string;
    lastName: string;
    email: string;
}

export const getUsers = async (): Promise<Array<User>> => {
    const postRepository = getRepository(User);
    return postRepository.find();
};

export const createUser = async (payload: IUserPayload): Promise<User> => {
    const postRepository = getRepository(User);
    const post = new User();
    return postRepository.save({
        ...post,
        ...payload,
    });
};

export const createUsers = async (payload: IUserPayload[]): Promise<User[]> => {
    const userRepository = getRepository(User);
    const user = new User();
    const saveRequests = payload.map((body) => { return {...user, ...body} })
    return userRepository.save(saveRequests).catch(err => err);
};

export const getUser = async (id: number): Promise<User | null> => {
    const postRepository = getRepository(User);
    const post = await postRepository.findOne({ id: id });
    if (!post) return null;
        return post;
};