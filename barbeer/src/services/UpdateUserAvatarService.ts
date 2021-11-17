import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import AppError from '../erros/AppError';

import uploadConfig from '../config/upload';
import User from '../models/Users'

interface Request {
  user_id: string;
  avatarFilename?: string;
}
class UpdateUserAvatarService {
  public async execute({ user_id, avatarFilename }: Request): Promise<User> {
    const usersRopository = getRepository(User);

    const user = await usersRopository.findOne(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can change avatar', 401);
    }

    if (user.avatar) {
      //Deletar o avatar

      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFilename || " nenhum ";

    await usersRopository.save(user);

    return user;
  }
}


export default UpdateUserAvatarService;
