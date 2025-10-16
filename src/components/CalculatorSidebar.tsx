import { Calculator } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { Calculators } from "@/components/Calculators";

export function CalculatorSidebar() {
  const { state } = useSidebar();

  return (
    <Sidebar side="right" className="border-l">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          {state !== "collapsed" && (
            <h2 className="font-semibold">Trading Calculators</h2>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          {state !== "collapsed" && (
            <SidebarGroupLabel>Calculate your trades</SidebarGroupLabel>
          )}
          <div className="p-4">
            <Calculators />
          </div>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
