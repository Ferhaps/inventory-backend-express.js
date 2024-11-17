import { authentication, random } from './../helpers/index';
import { createUser, getUserByEmail } from 'db/users';
import express from 'express';

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send('Email and password are required');
    }
    
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).send('User already exists');
    }
    
    const salt = random();
    const user = await createUser({
      email,
      authentication: {
        password: authentication(salt, password),
        salt,
      },
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};