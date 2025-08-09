import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

const CopyCodeButton = ({ content }: { content: string }) => {
  const { handleCopy } = useCopyToClipboard(content);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            handleCopy();
          }}
          className="animate-in fade-in slide-in-from-right-full ease-inout absolute top-2 right-2 duration-1000"
        >
          <Copy />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Copy the code snippet to your clipboard!</TooltipContent>
    </Tooltip>
  );
};

export default CopyCodeButton;
