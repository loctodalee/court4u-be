import Jwt from "jsonwebtoken";
export const createTokenPair = async ({
  payload,
  publicKey,
  privateKey,
}: {
  payload: any;
  publicKey: string;
  privateKey: string;
}): Promise<any> => {
  try {
    const accsessToken = await Jwt.sign(payload, publicKey, {
      expiresIn: "1 days",
    });

    const refreshToken = await Jwt.sign(payload, privateKey, {
      expiresIn: "3 days",
    });

    return { accsessToken, refreshToken };
  } catch (error) {}
};
