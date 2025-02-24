import { createThirdwebClient } from "thirdweb";
import { inAppWallet, createWallet } from "thirdweb/wallets";

const clientId = process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID;

if (!clientId) {
  throw new Error("No client ID provided");
}

export const wallets = [
  inAppWallet({
    auth: {
      options: ["email", "google", "apple"],
    },
  }),
  createWallet("io.metamask"),
];

export const client = createThirdwebClient({
  clientId: clientId,
});