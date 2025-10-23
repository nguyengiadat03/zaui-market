import { PropsWithChildren, ReactNode } from "react";

export interface SectionProps {
  title: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Section(props: PropsWithChildren<SectionProps>) {
  return (
    <div
      className={"bg-section ".concat(props.className ?? "")}
      onClick={props.onClick}
    >
      <div className="flex items-center justify-between px-4">
        <div className="text-lg font-semibold text-foreground py-4 w-full">
          {props.title}
        </div>
      </div>
      {props.children}
    </div>
  );
}
