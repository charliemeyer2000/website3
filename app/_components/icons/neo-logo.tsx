import { SVGProps } from "react";

/**
 * Neo brand mark: the tilted egg, generated from the surface
 * `(x + 2.2) * x^2 + 3.4 * (y^2 + z^2) = 1` projected orthographically from
 * the viewing angle that matches Neo's logo (IoU 0.98 vs the real favicon),
 * drawn as a `currentColor` outline matching the lucide-react line icons.
 */
const NeoLogo = (props: SVGProps<SVGSVGElement>) => (
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
    <path d="M10.77,4.56 L8.95,5.40 L7.17,6.58 L5.50,8.05 L4.05,9.73 L2.93,11.49 L2.23,13.18 L2.06,13.96 L2.00,14.68 L2.05,15.36 L2.22,16.01 L2.51,16.61 L2.91,17.18 L3.41,17.68 L4.05,18.17 L5.67,19.02 L7.66,19.65 L9.85,20.00 L12.08,20.06 L14.20,19.81 L16.16,19.28 L17.74,18.55 L19.13,17.60 L20.29,16.42 L21.14,15.13 L21.72,13.66 L21.99,12.11 L21.92,10.53 L21.53,8.98 L20.83,7.55 L19.87,6.30 L18.63,5.25 L17.24,4.51 L15.72,4.06 L14.11,3.93 L12.44,4.10 L10.77,4.56 Z" />
  </svg>
);

export default NeoLogo;
