type SpamEvalInput = {
  content: string
  ip?: string
  userAgent?: string
  authorEmail?: string
  authorName?: string
}

export type SpamEvalResult = {
  score: number
  reasons: string[]
  akismet?: 'spam' | 'ham' | 'error' | 'skipped'
}

// Simple heuristics-based score
export function heuristicSpamScore(text: string): SpamEvalResult {
  const reasons: string[] = []
  let score = 0
  const t = (text || '').toLowerCase()

  const linkCount = (t.match(/https?:\/\//g) || []).length
  if (linkCount >= 3) { score += 3; reasons.push(`many_links:${linkCount}`) }

  const blacklist = ['viagra', 'casino', 'loan', 'crypto', 'porn']
  const found = blacklist.filter(w => t.includes(w))
  if (found.length) { score += 2 + found.length; reasons.push(`blacklist:${found.join(',')}`) }

  if (t.length < 10) { score += 1; reasons.push('too_short') }
  if (t.length > 2000) { score += 1; reasons.push('too_long') }

  if (/(.)\1{6,}/.test(t)) { score += 2; reasons.push('repeated_chars') }

  return { score, reasons, akismet: 'skipped' }
}

// Optional Akismet REST check; returns 'spam'|'ham'|'error'|'skipped'
export async function akismetCheck(input: SpamEvalInput): Promise<'spam'|'ham'|'error'|'skipped'> {
  const apiKey = process.env.AKISMET_API_KEY
  const blog = process.env.AKISMET_SITE_URL
  if (!apiKey || !blog) return 'skipped'

  try {
    const endpoint = `https://${apiKey}.rest.akismet.com/1.1/comment-check`
    const body = new URLSearchParams()
    body.set('blog', blog)
    if (input.ip) body.set('user_ip', input.ip)
    if (input.userAgent) body.set('user_agent', input.userAgent)
    body.set('comment_type', 'comment')
    if (input.authorName) body.set('comment_author', input.authorName)
    if (input.authorEmail) body.set('comment_author_email', input.authorEmail)
    body.set('comment_content', input.content || '')

    const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body })
    const txt = (await res.text()).trim()
    if (txt === 'true') return 'spam'
    if (txt === 'false') return 'ham'
    return 'error'
  } catch {
    return 'error'
  }
}

export async function evaluateSpam(input: SpamEvalInput): Promise<SpamEvalResult> {
  const base = heuristicSpamScore(input.content)
  const ak = await akismetCheck(input)
  const reasons = [...base.reasons]
  let score = base.score
  if (ak === 'spam') { score += 5; reasons.push('akismet_spam') }
  if (ak === 'error') { reasons.push('akismet_error') }
  return { score, reasons, akismet: ak }
}
