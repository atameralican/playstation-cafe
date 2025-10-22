import React from 'react'
import { BentoGridDemo } from './bento'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BorderBeam } from '@/components/ui/border-beam'
import { ShineBorder } from '@/components/ui/shine-border'
import { Input } from '@/components/ui/input'

function OyunListesiPage() {
  return (
    <div>
        
      {/* <ToolbarDemo/> */}
      <Card className="relative w-full overflow-hidden">
        <ShineBorder borderWidth={2} shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
        <CardHeader>
          <CardTitle>  
          
              <Input
                type="text"
                placeholder="Oyun adı yazın..."
               //value={aramaMetni}
               //onChange={(e) => setAramaMetni(e.target.value)}
                className="lg:w-2/4 w-full "
              /></CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          <CardAction>
            <Button variant="link">Sign Up</Button>
            <Button variant="link">Sign Up</Button>
            <Button variant="link">Sign Up</Button>
            <Button variant="link">Sign Up</Button>
          </CardAction>
        </CardHeader>
        <hr />
        <CardContent>
          <BentoGridDemo />
        </CardContent>
             {/* <BorderBeam
        duration={6}
        size={400}
        className="from-transparent via-red-500 to-transparent"
      />
      <BorderBeam
        duration={6}
        delay={3}
        size={400}
        borderWidth={2}
        className="from-transparent via-blue-500 to-transparent"
      />
             <BorderBeam
        duration={5}
        size={500}
        className="from-transparent via-red-500 to-transparent"
      />
      <BorderBeam
        duration={5}
        delay={5}
        size={500}
        borderWidth={2}
        className="from-transparent via-blue-500 to-transparent"
      /> */}
      </Card>

    </div>
  );
}

export default  OyunListesiPage
