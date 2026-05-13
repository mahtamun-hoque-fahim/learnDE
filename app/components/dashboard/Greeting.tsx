'use client'

interface GreetingProps {
  name: string
  subtitle?: string
}

export function Greeting({ name, subtitle }: GreetingProps) {
  const getTimeGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="mb-5.5">
      <h1 className="text-[21px] font-black tracking-[-0.025em] mb-0.75">
        {getTimeGreeting()}, <em className="font-semibold not-italic">{name}</em>!
      </h1>
      {subtitle && <p className="text-[12.5px] text-[#8A938E] m-0">{subtitle}</p>}
    </div>
  )
}
