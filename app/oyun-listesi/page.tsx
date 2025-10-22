import React from 'react'
import { BentoGridDemo } from './bento'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BorderBeam } from '@/components/ui/border-beam'
import { ShineBorder } from '@/components/ui/shine-border'
import { Input } from '@/components/ui/input'
import ToogleGame from './toogleGame'

function OyunListesiPage() {
  return (
    <div>
        
      {/* <ToolbarDemo/> */}
      <Card className="relative w-full overflow-hidden">
        <ShineBorder borderWidth={2} shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
        <CardHeader>
          <CardTitle>  
          <div className='flex flex-row justify-between items-center'>
              <Input
                type="text"
                placeholder="Oyun adı yazın..."
               //value={aramaMetni}
               //onChange={(e) => setAramaMetni(e.target.value)}
                className="lg:w-2/4 w-full "
              />
               <ToogleGame/></div>
              </CardTitle>
          {/* <CardDescription>
            Arama yapacağınız oyuna
          </CardDescription> */}
          {/* <CardAction>
            <ToogleGame/>
          </CardAction> */}
        </CardHeader>
        <hr />
        <CardContent>
          <BentoGridDemo />
        </CardContent>
            
      </Card>

    </div>
  );
}

export default  OyunListesiPage
