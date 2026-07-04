import { SVGProps } from "react";

/**
 * Principal Financial Group brand mark (the "P"), adapted from the official
 * logo vector: the same outer disc, counter, seam, and tail, drawn as a
 * `currentColor` outline matching the lucide-react line icons used elsewhere.
 */
const PrincipalLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M3.84 11.33C3.84 16.86 8.09 21.49 13.60 22.00L13.60 14.96C11.02 14.71 9.24 12.81 9.24 10.28C9.24 7.83 10.88 6.06 13.14 6.06C15.21 6.06 16.61 7.35 16.61 9.26C16.61 10.95 15.53 12.05 13.60 12.35L13.60 14.96C17.58 14.85 20.16 12.43 20.16 8.80C20.16 4.88 17.09 2.00 12.90 2.00C7.74 2.00 3.84 6.03 3.84 11.33Z" />
  </svg>
);

export default PrincipalLogo;
