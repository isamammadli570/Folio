import {PRIVACY_UPDATED} from "@/constants/other";
import {LegalDocument} from "@/widgets/LegalDocument";

/** The privacy policy, linked from the footer, the sign-in pages and Google's consent screen. */
export const PrivacyPage = () => <LegalDocument doc="privacy" updated={PRIVACY_UPDATED}/>;
