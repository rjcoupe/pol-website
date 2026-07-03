import type { SectionHeadContent } from '../content';

export function SectionHead({ head }: { head: SectionHeadContent }) {
  return (
    <div className="sec-head reveal">
      <span className="kicker">{head.kicker}</span>
      <h2>{head.title}</h2>
      {head.lead && <p className="lead">{head.lead}</p>}
    </div>
  );
}
