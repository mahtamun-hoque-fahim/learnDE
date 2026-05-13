'use client'

interface StatCard {
  label: string
  value: string | number
  unit?: string
  delta?: {
    value: number | string
    positive: boolean
  }
  color?: 'mint' | 'blue' | 'amber' | 'rose'
}

interface StatsRowProps {
  stats: StatCard[]
}

export function StatsRow({ stats }: StatsRowProps) {
  const getColorClasses = (color?: string) => {
    switch (color) {
      case 'mint':
        return 'bg-gradient-to-br from-[rgba(61,244,154,0.05)] to-transparent'
      case 'blue':
        return 'bg-gradient-to-br from-[rgba(96,168,250,0.05)] to-transparent'
      case 'amber':
        return 'bg-gradient-to-br from-[rgba(245,168,92,0.05)] to-transparent'
      case 'rose':
        return 'bg-gradient-to-br from-[rgba(242,107,107,0.05)] to-transparent'
      default:
        return ''
    }
  }

  const getDotColor = (color?: string) => {
    switch (color) {
      case 'mint':
        return '--c: #3DF49A'
      case 'blue':
        return '--c: #60A8FA'
      case 'amber':
        return '--c: #F5A85C'
      case 'rose':
        return '--c: #F26B6B'
      default:
        return '--c: #3DF49A'
    }
  }

  return (
    <div className="grid grid-cols-4 gap-3 mb-4">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className={`bg-[#0E1110] border border-[#1F2421] rounded-[12px] p-4 relative overflow-hidden cursor-default ${getColorClasses(stat.color)}`}
          style={{ [getDotColor(stat.color) as any]: '' } as any}
        >
          {/* Gradient dot background */}
          <div
            className="absolute top-[-20px] right-[-20px] w-[80px] h-[80px] rounded-full opacity-6 pointer-events-none"
            style={{ backgroundColor: 'var(--c)' }}
          />

          <div className="relative z-10">
            <div className="text-[10px] text-[#8A938E] uppercase tracking-[0.13em] mb-1.75">
              {stat.label}
            </div>
            <div className="flex items-baseline gap-px">
              <span className="text-[28px] font-black tracking-[-0.03em] font-mono leading-none">
                {stat.value}
              </span>
              {stat.unit && <span className="text-[13px] font-medium text-[#8A938E]">{stat.unit}</span>}
            </div>
            {stat.delta && (
              <div className={`text-[11px] text-[#8A938E] mt-1.25 ${stat.delta.positive ? 'text-[#3DF49A]' : 'text-[#F26B6B]'}`}>
                {stat.delta.positive ? '↑' : '↓'} {stat.delta.value}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
