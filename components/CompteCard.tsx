import React from 'react';
import {
  ImageBackground,
  View,
  Text,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';

// ─── Sector-aware texture mapping ────────────────────────────────────────────
//
//  - Classe 6 & 7 (Charges / Produits)  → dark financial data overlay
//  - All others / default               → light neutral marble texture

const TEXTURE_FINANCIAL: ImageSourcePropType = require('../assets/images/texture_charges.png');
const TEXTURE_NEUTRAL: ImageSourcePropType = require('../assets/images/texture_neutral.png');

function getSectorTexture(accountCode: string): ImageSourcePropType {
  const prefix = accountCode.replace(/\D/g, '').charAt(0);
  if (prefix === '6' || prefix === '7') return TEXTURE_FINANCIAL;
  return TEXTURE_NEUTRAL;
}

// ─── Color-coded left border accent based on PCGE class ──────────────────────

const CLASS_ACCENT: Record<string, string> = {
  '1': '#1e3a8a', // Financement Permanent  – Navy
  '2': '#1e40af', // Actif Immobilisé       – Blue-800
  '3': '#0891b2', // Actif Circulant        – Cyan-600 (Credit vibe)
  '4': '#6b21a8', // Passif Circulant       – Purple-800
  '5': '#b45309', // Trésorerie             – Amber-700
  '6': '#991b1b', // Charges                – Red-800 (Bordeaux/Debit vibe)
  '7': '#059669', // Produits               – Emerald-600
  '8': '#1e293b', // Résultats              – Slate-800
};

function getAccentColor(accountCode: string): string {
  const prefix = accountCode.replace(/\D/g, '').charAt(0);
  return CLASS_ACCENT[prefix] ?? '#0ea5e9';
}

// ─── Props ───────────────────────────────────────────────────────────────────

export interface CompteCardProps {
  /** Account code, e.g. "611", "613/614", "CLASSE 6" */
  code: string;
  /** Human-readable label / title */
  label: string;
  /** Optional sub-description (shown below the label on hub cards) */
  description?: string;
  /** Optional emoji icon shown in a colored badge (hub mode) */
  icon?: string;
  /** Optional detail type: 'Poste' | 'Rubrique' | 'Classe' */
  kind?: string;
  onPress?: () => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function CompteCard({
  code,
  label,
  description,
  icon,
  kind = 'Poste',
  onPress,
}: CompteCardProps) {
  const texture = getSectorTexture(code);
  const accent = getAccentColor(code);
  // Dark texture for Classe 6 & 7; also darken when there's no icon (detail cards)
  const isDark = ['6', '7'].includes(code.replace(/\D/g, '').charAt(0));
  // Hub mode = icon is provided (home page cards show icon + description)
  const isHubMode = !!icon;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.82}
      className="mb-3 mx-4"
      style={{
        borderRadius: 20,
        overflow: 'hidden',
        // Premium colored shadow
        shadowColor: accent,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.18,
        shadowRadius: 14,
        elevation: 8,
        // Color-coded left accent border
        borderLeftWidth: 6,
        borderLeftColor: accent,
      }}
    >
      {/* ── Background texture ── */}
      <ImageBackground
        source={texture}
        resizeMode="cover"
        style={{ overflow: 'hidden', borderRadius: 20 }}
      >
        {/* ── Overlay for legibility ── */}
        <View
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: isDark
              ? 'rgba(15, 23, 42, 0.55)'    // slate-900/55% – dark
              : 'rgba(255, 255, 255, 0.78)', // white/78%     – light
          }}
        />

        {/* ── Card body ── */}
        <View className="flex-row items-center px-5 py-4">

          {/* ── LEFT SECTION ─────────────────────────────────── */}
          {isHubMode ? (
            /* Hub mode: colored emoji badge */
            <View
              style={{
                width: 54,
                height: 54,
                borderRadius: 14,
                backgroundColor: isDark
                  ? 'rgba(255,255,255,0.12)'
                  : `${accent}22`,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 14,
              }}
            >
              <Text style={{ fontSize: 26 }}>{icon}</Text>
            </View>
          ) : (
            /* Detail mode: large bold code number */
            <View className="items-center mr-5" style={{ minWidth: 68 }}>
              <Text
                style={{
                  fontWeight: '900',
                  fontSize: 28,
                  letterSpacing: -0.5,
                  color: isDark ? '#f1f5f9' : '#0f172a',
                }}
              >
                {code}
              </Text>
              <View className="flex-row items-center mt-0.5">
                <Text style={{ fontSize: 11, fontWeight: '500', color: isDark ? '#94a3b8' : '#64748b' }}>
                  {kind}
                </Text>
                <Text style={{ fontSize: 14, color: isDark ? '#94a3b8' : '#64748b', marginLeft: 1 }}>
                  {' ›'}
                </Text>
              </View>
            </View>
          )}

          {/* ── Vertical divider ── */}
          <View
            style={{
              width: 1.5,
              height: 44,
              backgroundColor: accent,
              opacity: 0.45,
              marginRight: 14,
              borderRadius: 2,
            }}
          />

          {/* ── RIGHT SECTION: text ── */}
          <View className="flex-1">
            {/* In hub mode, show the CLASSE X label in small caps above the title */}
            {isHubMode && (
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: '800',
                  color: accent,
                  letterSpacing: 1.2,
                  textTransform: 'uppercase',
                  marginBottom: 2,
                }}
              >
                {code}
              </Text>
            )}
            <Text
              numberOfLines={2}
              style={{
                fontWeight: isHubMode ? '700' : '500',
                fontSize: isHubMode ? 16 : 14.5,
                lineHeight: 22,
                color: isDark ? '#e2e8f0' : '#0f172a',
              }}
            >
              {label}
            </Text>
            {description && (
              <Text
                numberOfLines={2}
                style={{
                  fontSize: 12,
                  lineHeight: 17,
                  marginTop: 3,
                  color: isDark ? '#94a3b8' : '#64748b',
                }}
              >
                {description}
              </Text>
            )}
          </View>

          {/* ── Chevron ── */}
          <Text
            style={{
              fontSize: 20,
              color: isDark ? '#475569' : '#cbd5e1',
              marginLeft: 6,
            }}
          >
            ›
          </Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}
