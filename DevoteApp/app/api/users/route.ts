import { NextResponse } from "next/server";
import connectToDb from "../../../lib/mongodb/mongodb";
import Citizen from "../../../models/citizen";
import User from "../../../models/user";
import crypto from "crypto";
import { createKyc, getSdkLink } from "../../../lib/kyc";
import { EmailService } from "../../../lib/email";
import {
  generatePrivateKeyEncrypted,
  getFutureWalletAdressFromPrivateKey,
} from "@/lib/starknet/createWallet";

function hashIne(ine: string): string {
  return crypto.createHash("sha256").update(ine).digest("hex");
}

export async function POST(req: Request) {
  try {
    const { email, ine } = await req.json();

    if (!email || !ine) {
      return NextResponse.json(
        { message: "Email and ine are required" },
        { status: 400 }
      );
    }

    await connectToDb();

    // const citizen = await Citizen.findOne({ ine }).exec();
    // if (!citizen) {
    //   return NextResponse.json(
    //     { message: "Citizen not found with provided ine" },
    //     { status: 404 }
    //   );
    // }

    const hashedIne = hashIne(ine);

    const existingUser = await User.findOne({ hasIne: hashedIne }).exec();
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists with provided ine" },
        { status: 400 }
      );
    }

    // const name = `${citizen.firstName} ${citizen.lastName}`;

    const privateKey = generatePrivateKeyEncrypted("1234");

    const walletAddress = getFutureWalletAdressFromPrivateKey(
      privateKey,
      "1234"
    );

    const newUser = new User({
      walletId: walletAddress,
      // name,
      email,
      // hashIne: hashedIne,
      // kycStatus: "pending",
      // kycId: "",
      secretKey: privateKey,
    });

    await newUser.save();

    // const kycId = await createKyc(String(newUser._id), newUser.email);

    // newUser.kycId = kycId;

    await newUser.save();

    const emailEncoded = encodeURI(newUser.email);
    const sdkLink = `https://devote.site/verify?kycId=${newUser._id}&email=${emailEncoded}`,
      url = "",
      userId = "";

    const emailService = new EmailService();
    const subject = "Complete your KYC process";
    const text = `Please use the following link to complete your KYC process: ${sdkLink}`;
    const html = `<p>A user account has been created for you. Please click the following link to set your password: ${url}/verification-submitted?id=${userId}</p>`;

    await emailService.sendMail(newUser.email, subject, text, html);

    return NextResponse.json(
      { message: "User created and KYC initiated successfully", user: newUser },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(
      "Error creating user with KYC:",
      error?.response?.data || error.message
    );
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await connectToDb();
    const users = await User.find({}).lean().exec();
    return NextResponse.json({ users }, { status: 200 });
  } catch (error: any) {
    console.error("Error retrieving users:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
