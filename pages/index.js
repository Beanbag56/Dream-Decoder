import dynamic from 'next/dynamic';

const DreamDecoder = dynamic(() => import('../components/DreamDecoder'), { ssr: false });

export default function Home() {
  return <DreamDecoder />;
}
