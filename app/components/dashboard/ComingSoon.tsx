import { Card } from './Cards'

interface ComingSoonProps {
  featureName: string
  description?: string
}

export function ComingSoon({ featureName, description }: ComingSoonProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-6">
      <Card className="max-w-md w-full text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-[rgba(61,244,154,0.08)] border border-[rgba(61,244,154,0.22)] flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3DF49A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
        </div>
        <h2 className="text-[16px] font-bold tracking-[-0.02em] mb-1.5">{featureName}</h2>
        <p className="text-[12.5px] text-[#8A938E] leading-[1.55]">
          {description ?? 'This view is on the roadmap. Check back soon.'}
        </p>
      </Card>
    </div>
  )
}
