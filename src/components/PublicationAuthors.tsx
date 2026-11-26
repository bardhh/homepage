import { Fragment } from 'react';

export default function PublicationAuthors({ names }: { names: string[] }) {
  return names.map((name, index) => (
    <Fragment key={index}>
      {index > 0 && ', '}
      {name === 'Bardh Hoxha' || name === 'B. Hoxha' ? <strong className="font-semibold">{name}</strong> : name}
    </Fragment>
  ));
}
