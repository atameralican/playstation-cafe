import {
  Badge,
  Box,
  Card,
  Flex,
  IconButton,
  Text,
} from "@radix-ui/themes";
import { IconEdit } from "@tabler/icons-react";
import React from "react";
import DeleteAlertModal from "./deleteAlertDep";
import Image from "next/image";
import nonePhoto from "@/public/logo.png"
interface Oyun {
  id: number;
  created_at: string;
  oyun_adi: string;
  cihaz_turu: string;
  kac_kisilik: number;
  kategori: string;
  ea_playde_mi: boolean;
  gorsel: string | null;
}

function GameAddPageCard({
  data,
  deleteOnClick,
  updateOnClick,
}: {
  data: Oyun[];
  deleteOnClick: (id: number) => void;
  updateOnClick: (oyun: Oyun) => void;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {data.map((oyun) => (
        <Box key={oyun.id}>
          <Card>
            <div className="flex gap-3 items-center">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-200">
                
                  <Image
                    src={oyun.gorsel||nonePhoto}
                    alt={oyun.oyun_adi}
                    fill
                    className="object-cover"
                  />
                
              </div>

              <Box>
                <Text as="div" size="2" weight="bold">
                  {oyun.oyun_adi}
                </Text>

                <Flex gap="2">
                  <Text as="div" size="2" color="gray">
                    {oyun.kategori}
                  </Text>
                  <Badge color="indigo" >
                    {oyun.cihaz_turu}
                  </Badge>
                  <Badge color="cyan">{oyun.kac_kisilik} Kişi</Badge>
                  {oyun?.ea_playde_mi && <Badge color="orange">EA</Badge>}
                </Flex>
              </Box>

              <Flex className="flex gap-3 text-end ml-auto">
                <IconButton
                  onClick={() => updateOnClick(oyun)}
                  size="1"
                  variant="ghost"
                >
                  <IconEdit width="18" height="18" />
                </IconButton>
                <DeleteAlertModal onClick={() => deleteOnClick(oyun.id)} />
              </Flex>
            </div>
          </Card>
        </Box>
      ))}
    </div>
  );
}

export default GameAddPageCard;
