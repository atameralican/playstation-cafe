"use client";
import { Card } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { Gamepad2 } from "lucide-react";
import React, { useState } from "react";

function ToogleGame() {
  const [psType, setPsType] = useState({
    ps5: true,
    ps4: true,
    ps3: true,
  });
  const [person, setPerson] = useState({ bir: true, iki: true, dort: true });

  const tooglePerson = (format: keyof typeof person) => {
    setPerson((prev) => ({
      ...prev,
      [format]: !prev[format],
    }));
  };
  const tooglePsType = (format: keyof typeof psType) => {
    setPsType((prev) => ({
      ...prev,
      [format]: !prev[format],
    }));
  };

  return (
    <Card className="p-2 w-fit">
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-1">
          <Toggle
            pressed={person.bir}
            onPressedChange={() => tooglePerson("bir")}
            aria-label="1 kişilik oyun"
            size="sm"
          >
            <div className="relative">
              <Gamepad2 className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 text-[10px] font-bold"></span>
            </div>
          </Toggle>
          <Toggle
            pressed={person.iki}
            onPressedChange={() => tooglePerson("iki")}
            aria-label="2 kişilik oyun"
            size="sm"
          >
            <div className="relative">
              <Gamepad2 className="w-4 h-4" />
              <span className="absolute -top-2 -right-1 text-[10px] font-bold">
                2
              </span>
            </div>
          </Toggle>
          <Toggle
            pressed={person.dort}
            onPressedChange={() => tooglePerson("dort")}
            aria-label="4 kişilik oyun"
            size="sm"
          >
            <div className="relative">
              <Gamepad2 className="w-4 h-4" />
              <span className="absolute -top-2 -right-1 text-[10px] font-bold">
                4
              </span>
            </div>
          </Toggle>
        </div>

        <hr className="w-px h-6 bg-gray-400 dark:bg-gray-400 border-0  mx-3  " />

        {/* Lists and links */}
        <div className="flex items-center gap-1">
          <Toggle
            pressed={psType.ps5}
            onPressedChange={() => tooglePsType("ps5")}
            aria-label="Playstation5"
            size="sm"
          >
            PS5
          </Toggle>
          <Toggle
            pressed={psType.ps4}
            onPressedChange={() => tooglePsType("ps4")}
            aria-label="Playstation4"
            size="sm"
          >
            PS4
          </Toggle>
          <Toggle
            pressed={psType.ps3}
            onPressedChange={() => tooglePsType("ps3")}
            aria-label="Playstation3"
            size="sm"
          >
            PS3
          </Toggle>
        </div>
      </div>
    </Card>
  );
}

export default ToogleGame;
