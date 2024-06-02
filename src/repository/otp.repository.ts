// import { $Enums, otp } from "@prisma/client";
// import { IOtpRepository } from "./iOtp.Repository";
// import prisma from "../lib/prisma";
// export class OtpRepository implements IOtpRepository {
//   private static Instance: OtpRepository;
//   public static getInstance(): OtpRepository {
//     if (!OtpRepository.Instance) {
//       OtpRepository.Instance = new OtpRepository();
//     }
//     return OtpRepository.Instance;
//   }
//   async createOtp({
//     email,
//     token,
//   }: {
//     email: string;
//     token: number;
//   }): Promise<otp> {
//     var newToken = await prisma.otp.create({
//       data: {
//         otpEmail: email,
//         otpToken: token,
//       },
//     });
//     return newToken;
//   }
// }
