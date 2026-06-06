"use client";

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Footer } from '@/components/sections';
import { calculatorsConfig, CalculatorCategory } from '@/utils/calculatorsConfig';

const CATEGORIES: Array<{ key: 'all' | CalculatorCategory; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'investment', label: 'Mutual Funds & Stocks' },
  { key: 'loan', label: 'Loans & EMIs' },
  { key: 'retirement', label: 'Retirement & Pension' },
  { key: 'banking', label: 'Banking & Post Office' },
  { key: 'tax', label: 'Taxes & Salary' },
];

const CalculatorDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | CalculatorCategory>('all');

  const allCalculators = Object.values(calculatorsConfig);

  const filteredCalculators = allCalculators.filter((calc) => {
    const matchesCategory = activeCategory === 'all' || calc.category === activeCategory;
    const matchesSearch =
      calc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      calc.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      calc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="main-wrapper investment-main" style={{ paddingBottom: '96px' }}>
        <section className="padding-global">
          <div className="container-large investment-shell" style={{ maxWidth: '75rem' }}>
            
            {/* Dashboard Title Header */}
            <div style={{ textAlign: 'center', marginBottom: '3.5rem', marginTop: '1.5rem' }}>
              <span 
                style={{ 
                  textTransform: 'uppercase', 
                  fontSize: '0.85rem', 
                  fontWeight: 800, 
                  letterSpacing: '0.15em', 
                  color: '#000000',
                  border: '1px solid #000000',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '999px',
                  display: 'inline-block',
                  marginBottom: '1rem'
                }}
              >
                Calculators
              </span>
              <h1 className="display_xl-class" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, textTransform: 'uppercase', lineHeight: 0.9 }}>
                Indian Market Calculators
              </h1>
              <p style={{ color: '#666666', fontSize: '1.1rem', marginTop: '1rem', maxWidth: '38rem', marginLeft: 'auto', marginRight: 'auto' }}>
                Calculate investments, loan EMIs, retirement goals, and tax liabilities with calculators tailored for the Indian financial market.
              </p>
            </div>

            {/* Search and Filter Row */}
            <div 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '1.5rem', 
                marginBottom: '2.5rem' 
              }}
            >
              {/* Search Box */}
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  type="text"
                  placeholder="Search calculators (e.g. SIP, EMI, Tax, PPF)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '1rem 1.25rem',
                    fontSize: '1.05rem',
                    border: '1px solid #000000',
                    borderRadius: '0.5rem',
                    background: '#ffffff',
                    color: '#000000',
                    outline: 'none',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                    transition: 'all 180ms ease'
                  }}
                  className="calculator-search-input"
                />
              </div>

              {/* Category Filters Row */}
              <div 
                className="investment-tab-row" 
                style={{ 
                  borderBottom: 'none', 
                  padding: '0.5rem 0', 
                  justifyContent: 'flex-start',
                  gap: '0.5rem' 
                }}
              >
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.key}
                    type="button"
                    className={`investment-tab ${activeCategory === cat.key ? 'is-active' : ''}`}
                    onClick={() => setActiveCategory(cat.key)}
                    style={{
                      border: '1px solid ' + (activeCategory === cat.key ? '#000000' : '#e5e5e5'),
                      borderRadius: '999px',
                      padding: '0.55rem 1.2rem',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid of Calculator Cards */}
            {filteredCalculators.length > 0 ? (
              <div 
                className="calculator-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(20rem, 1fr))',
                  gap: '1.25rem',
                  marginTop: '1rem'
                }}
              >
                {filteredCalculators.map((calc) => (
                  <Link
                    key={calc.slug}
                    href={`/investment-calculators/${calc.slug}`}
                    className="calculator-card-link"
                    style={{ textDecoration: 'none' }}
                  >
                    <div 
                      className="investment-control"
                      style={{
                        padding: '1.75rem',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '1.25rem',
                        cursor: 'pointer',
                        transition: 'transform 180ms ease, border-color 180ms ease'
                      }}
                    >
                      <div>
                        {/* Header Label / Tag */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: '0.75rem' }}>
                          <span 
                            style={{ 
                              fontSize: '0.68rem', 
                              fontWeight: 800, 
                              textTransform: 'uppercase', 
                              letterSpacing: '0.1em',
                              background: '#f0f0f0',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '4px',
                              color: '#555555'
                            }}
                          >
                            {calc.category}
                          </span>
                          
                          {calc.isPopular && (
                            <span 
                              style={{ 
                                fontSize: '0.62rem', 
                                fontWeight: 800, 
                                textTransform: 'uppercase', 
                                letterSpacing: '0.08em',
                                background: '#000000',
                                color: '#ffffff',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px'
                              }}
                            >
                              Popular
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 
                          style={{ 
                            fontSize: '1.25rem', 
                            fontWeight: 800, 
                            color: '#000000', 
                            margin: '0 0 0.5rem 0',
                            textTransform: 'uppercase'
                          }}
                        >
                          {calc.title}
                        </h3>

                        {/* Description */}
                        <p style={{ color: '#666666', fontSize: '0.88rem', margin: 0, lineHeight: 1.4 }}>
                          {calc.description}
                        </p>
                      </div>

                      {/* Action trigger label */}
                      <span 
                        style={{ 
                          fontSize: '0.82rem', 
                          fontWeight: 700, 
                          color: '#000000', 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '0.35rem',
                          marginTop: '0.5rem'
                        }}
                      >
                        Calculate Now →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div 
                style={{ 
                  textAlign: 'center', 
                  padding: '5rem 2rem', 
                  border: '1px dashed #cccccc', 
                  borderRadius: '1rem' 
                }}
              >
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#333333' }}>
                  No calculators found
                </h3>
                <p style={{ color: '#777777', fontSize: '0.95rem', marginTop: '0.5rem' }}>
                  Try refining your search terms or choosing a different filter.
                </p>
              </div>
            )}

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CalculatorDashboard;
