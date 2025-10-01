"use client";

import { startTransition, useMemo, useOptimistic, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { celebrityPersonas, getCelebrityPersonaById } from "@/lib/celebrity-personas";
import { cn } from "@/lib/utils";
import { CheckCircleFillIcon, ChevronDownIcon } from "./icons";

export function CelebrityPersonaSelector({
  selectedPersonaId,
  onPersonaChange,
  disabled = false,
  className,
}: {
  selectedPersonaId: string;
  onPersonaChange: (personaId: string) => void;
  disabled?: boolean;
} & React.ComponentProps<typeof Button>) {
  const [open, setOpen] = useState(false);
  const [optimisticPersonaId, setOptimisticPersonaId] =
    useOptimistic(selectedPersonaId);

  const selectedPersona = useMemo(
    () => getCelebrityPersonaById(optimisticPersonaId),
    [optimisticPersonaId]
  );

  const handlePersonaChange = (personaId: string) => {
    setOpen(false);
    startTransition(() => {
      setOptimisticPersonaId(personaId);
      onPersonaChange(personaId);
      // Save to cookie for persistence
      document.cookie = `celebrity-persona=${personaId}; path=/; max-age=${60 * 60 * 24 * 30}`;
    });
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">Chatting with:</span>
      <DropdownMenu onOpenChange={setOpen} open={open}>
        <DropdownMenuTrigger
          asChild
          className={cn(
            "w-fit data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
            className
          )}
        >
          <Button
            className="md:h-[34px] md:px-2"
            data-testid="celebrity-persona-selector"
            disabled={disabled}
            variant="outline"
          >
            <span className="mr-2">{selectedPersona?.avatar}</span>
            {selectedPersona?.name}
            <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="min-w-[320px] max-w-[90vw] sm:min-w-[350px]"
        >
          {celebrityPersonas.map((persona) => {
            const { id } = persona;

            return (
              <DropdownMenuItem
                asChild
                data-active={id === optimisticPersonaId}
                data-testid={`celebrity-persona-item-${id}`}
                key={id}
                onSelect={() => handlePersonaChange(id)}
              >
                <button
                  className="group/item flex w-full flex-row items-center justify-between gap-2 sm:gap-4"
                  type="button"
                >
                  <div className="flex flex-col items-start gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{persona.avatar}</span>
                      <div className="text-sm sm:text-base font-medium">{persona.name}</div>
                    </div>
                    <div className="line-clamp-2 text-muted-foreground text-xs">
                      {persona.description}
                    </div>
                    <div className="line-clamp-1 text-muted-foreground text-xs italic">
                      {persona.personality}
                    </div>
                  </div>

                  <div className="shrink-0 text-foreground opacity-0 group-data-[active=true]/item:opacity-100 dark:text-foreground">
                    <CheckCircleFillIcon />
                  </div>
                </button>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
