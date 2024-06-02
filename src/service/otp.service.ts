// import { $Enums, otp } from "@prisma/client";
// import { IOtpService } from "./iOtp.service";
// import { IOtpRepository } from "../repository/iOtp.Repository";
// import { OtpRepository } from "../repository/otp.repository";
// import crypto from "crypto";
// export class OtpSerivce implements IOtpService {
//   private readonly _otpRepository: IOtpRepository;
//   constructor() {
//     this._otpRepository = OtpRepository.getInstance();
//   }
//   generateRandomToken(): number {
//     const token = crypto.randomInt(0, Math.pow(2, 32));
//     return token;
//   }
//   async newOtp({ email }: { email: string }): Promise<otp> {
//     const token = this.generateRandomToken();

//     const newOtp = await this._otpRepository.createOtp({
//       email,
//       token,
//     });

//     return newOtp;
//   }
// }
