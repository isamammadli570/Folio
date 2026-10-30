import {TERMS_UPDATED} from "@/constants/other";
import {LegalDocument} from "@/widgets/LegalDocument";

/** The terms of use, linked from the footer and the sign-up form. */
export const TermsPage = () => <LegalDocument doc="terms" updated={TERMS_UPDATED}/>;
