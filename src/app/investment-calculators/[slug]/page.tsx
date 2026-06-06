import { calculatorsConfig } from '@/utils/calculatorsConfig';
import CalculatorClient from './CalculatorClient';

export function generateStaticParams() {
  return Object.keys(calculatorsConfig).map((slug) => ({
    slug,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  return <CalculatorClient slug={slug} />;
}
