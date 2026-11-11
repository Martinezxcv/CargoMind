package com.cargomind.backend.util;

import java.text.Normalizer;
import java.util.Locale;
import java.util.regex.Pattern;

/**
 * Normalizes user input to the form used as lookup key in the database:
 * trimmed, UPPERCASE, without diacritics ("Kraków" -> "KRAKOW").
 */
public final class TextNormalizer {

    private static final Pattern DIACRITICS = Pattern.compile("\\p{M}+");

    private TextNormalizer() {
    }

    public static String normalizeCityName(String value) {
        if (value == null) {
            return null;
        }
        // 'ł' has no Unicode decomposition, so it must be replaced explicitly
        String s = value.trim().replace('ł', 'l').replace('Ł', 'L');
        s = DIACRITICS.matcher(Normalizer.normalize(s, Normalizer.Form.NFD)).replaceAll("");
        return s.toUpperCase(Locale.ROOT);
    }
}