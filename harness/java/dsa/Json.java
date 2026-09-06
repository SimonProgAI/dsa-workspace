// Minimal JSON reader for the DSA workspace test harness.
//
// No dependencies, no JUnit, no Jackson: it exists only so Java solutions can
// read the same tests/<problem>.json files as C++, Python and TypeScript.
// Integers are kept as long (not double), so large values survive exactly.
//
// Compiled to harness/java/out, which the "Run Java Active File" task puts on
// the classpath. Solutions rarely need to import this directly -- the lambda
// passed to TestRunner.runJsonCases infers it.
package dsa;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public final class Json {

    public enum Type { NULL, BOOLEAN, INTEGER, DOUBLE, STRING, ARRAY, OBJECT }

    public static final Json NULL = new Json(Type.NULL, null);

    private final Type type;
    private final Object value;

    private Json(Type type, Object value) {
        this.type = type;
        this.value = value;
    }

    // --- factories ---------------------------------------------------------

    public static Json of(boolean v) { return new Json(Type.BOOLEAN, v); }
    public static Json of(long v) { return new Json(Type.INTEGER, v); }
    public static Json of(double v) { return new Json(Type.DOUBLE, v); }
    public static Json of(String v) { return v == null ? NULL : new Json(Type.STRING, v); }
    public static Json array(List<Json> v) { return new Json(Type.ARRAY, v); }
    public static Json object(Map<String, Json> v) { return new Json(Type.OBJECT, v); }

    // --- inspection --------------------------------------------------------

    public Type type() { return type; }
    public boolean isNull() { return type == Type.NULL; }
    public boolean isNumber() { return type == Type.INTEGER || type == Type.DOUBLE; }
    public boolean isArray() { return type == Type.ARRAY; }
    public boolean isObject() { return type == Type.OBJECT; }

    /** Element count for arrays and objects; 0 for everything else. */
    public int size() {
        if (type == Type.ARRAY) return items().size();
        if (type == Type.OBJECT) return members().size();
        return 0;
    }

    public boolean asBoolean() {
        expect(Type.BOOLEAN);
        return (Boolean) value;
    }

    public long asLong() {
        if (type == Type.INTEGER) return (Long) value;
        if (type == Type.DOUBLE) return (long) (double) (Double) value;
        throw new IllegalStateException("json: expected a number, got " + type);
    }

    public int asInt() { return (int) asLong(); }

    public double asDouble() {
        if (type == Type.INTEGER) return (Long) value;
        if (type == Type.DOUBLE) return (Double) value;
        throw new IllegalStateException("json: expected a number, got " + type);
    }

    public String asString() {
        expect(Type.STRING);
        return (String) value;
    }

    @SuppressWarnings("unchecked")
    public List<Json> items() {
        expect(Type.ARRAY);
        return (List<Json>) value;
    }

    @SuppressWarnings("unchecked")
    public Map<String, Json> members() {
        expect(Type.OBJECT);
        return (Map<String, Json>) value;
    }

    /** Array element access. */
    public Json get(int index) {
        List<Json> list = items();
        if (index < 0 || index >= list.size()) {
            throw new IndexOutOfBoundsException("json: array index out of range: " + index);
        }
        return list.get(index);
    }

    /** Object member access; throws when the key is missing. */
    public Json get(String key) {
        Json found = members().get(key);
        if (found == null) throw new IllegalArgumentException("json: no such key: " + key);
        return found;
    }

    public boolean has(String key) {
        return type == Type.OBJECT && members().containsKey(key);
    }

    /** The member if present, otherwise {@code fallback}. */
    public Json getOr(String key, Json fallback) {
        return has(key) ? get(key) : fallback;
    }

    // --- conversions for the shapes DSA problems actually use ---------------

    public int[] ints() {
        List<Json> list = items();
        int[] out = new int[list.size()];
        for (int i = 0; i < out.length; i++) out[i] = list.get(i).asInt();
        return out;
    }

    public long[] longs() {
        List<Json> list = items();
        long[] out = new long[list.size()];
        for (int i = 0; i < out.length; i++) out[i] = list.get(i).asLong();
        return out;
    }

    public double[] doubles() {
        List<Json> list = items();
        double[] out = new double[list.size()];
        for (int i = 0; i < out.length; i++) out[i] = list.get(i).asDouble();
        return out;
    }

    public String[] strings() {
        List<Json> list = items();
        String[] out = new String[list.size()];
        for (int i = 0; i < out.length; i++) out[i] = list.get(i).asString();
        return out;
    }

    public int[][] matrix() {
        List<Json> list = items();
        int[][] out = new int[list.size()][];
        for (int i = 0; i < out.length; i++) out[i] = list.get(i).ints();
        return out;
    }

    private void expect(Type wanted) {
        if (type != wanted) throw new IllegalStateException("json: expected " + wanted + ", got " + type);
    }

    // --- parsing -----------------------------------------------------------

    public static Json parse(String text) {
        Parser parser = new Parser(text);
        Json value = parser.parseDocument();
        return value;
    }

    public static Json parseFile(Path path) throws IOException {
        return parse(new String(Files.readAllBytes(path), StandardCharsets.UTF_8));
    }

    private static final class Parser {
        private final String text;
        private int pos;

        Parser(String text) { this.text = text; }

        Json parseDocument() {
            skipWhitespace();
            Json value = parseValue();
            skipWhitespace();
            if (pos != text.length()) fail("trailing characters after the top-level value");
            return value;
        }

        private RuntimeException failure(String message) {
            return new IllegalArgumentException("json: " + message + " (at offset " + pos + ")");
        }

        private void fail(String message) { throw failure(message); }

        private void skipWhitespace() {
            while (pos < text.length()) {
                char c = text.charAt(pos);
                if (c == ' ' || c == '\t' || c == '\n' || c == '\r') pos++;
                else break;
            }
        }

        private char peek() {
            if (pos >= text.length()) throw failure("unexpected end of input");
            return text.charAt(pos);
        }

        private boolean literal(String word) {
            if (!text.startsWith(word, pos)) return false;
            pos += word.length();
            return true;
        }

        private Json parseValue() {
            char c = peek();
            switch (c) {
                case '{': return parseObject();
                case '[': return parseArray();
                case '"': return Json.of(parseString());
                case 't':
                    if (literal("true")) return Json.of(true);
                    throw failure("invalid literal");
                case 'f':
                    if (literal("false")) return Json.of(false);
                    throw failure("invalid literal");
                case 'n':
                    if (literal("null")) return Json.NULL;
                    throw failure("invalid literal");
                default: return parseNumber();
            }
        }

        private Json parseObject() {
            pos++;  // '{'
            Map<String, Json> entries = new LinkedHashMap<>();
            skipWhitespace();
            if (peek() == '}') { pos++; return Json.object(entries); }
            while (true) {
                skipWhitespace();
                if (peek() != '"') fail("expected a string key");
                String key = parseString();
                skipWhitespace();
                if (peek() != ':') fail("expected ':' after the key");
                pos++;
                skipWhitespace();
                entries.put(key, parseValue());
                skipWhitespace();
                char c = peek();
                if (c == ',') { pos++; continue; }
                if (c == '}') { pos++; break; }
                fail("expected ',' or '}'");
            }
            return Json.object(entries);
        }

        private Json parseArray() {
            pos++;  // '['
            List<Json> values = new ArrayList<>();
            skipWhitespace();
            if (peek() == ']') { pos++; return Json.array(values); }
            while (true) {
                skipWhitespace();
                values.add(parseValue());
                skipWhitespace();
                char c = peek();
                if (c == ',') { pos++; continue; }
                if (c == ']') { pos++; break; }
                fail("expected ',' or ']'");
            }
            return Json.array(values);
        }

        private String parseString() {
            pos++;  // opening quote
            StringBuilder out = new StringBuilder();
            while (true) {
                if (pos >= text.length()) fail("unterminated string");
                char c = text.charAt(pos++);
                if (c == '"') break;
                if (c != '\\') { out.append(c); continue; }
                if (pos >= text.length()) fail("unterminated escape sequence");
                char esc = text.charAt(pos++);
                switch (esc) {
                    case '"': out.append('"'); break;
                    case '\\': out.append('\\'); break;
                    case '/': out.append('/'); break;
                    case 'b': out.append('\b'); break;
                    case 'f': out.append('\f'); break;
                    case 'n': out.append('\n'); break;
                    case 'r': out.append('\r'); break;
                    case 't': out.append('\t'); break;
                    case 'u': out.append((char) parseHex4()); break;  // UTF-16, so surrogates just work
                    default: fail("unknown escape sequence");
                }
            }
            return out.toString();
        }

        private int parseHex4() {
            if (pos + 4 > text.length()) fail("truncated \\u escape");
            int value = 0;
            for (int i = 0; i < 4; i++) {
                char c = text.charAt(pos++);
                int digit = Character.digit(c, 16);
                if (digit < 0) fail("invalid hex digit in \\u escape");
                value = value * 16 + digit;
            }
            return value;
        }

        private Json parseNumber() {
            int start = pos;
            if (pos < text.length() && (text.charAt(pos) == '-' || text.charAt(pos) == '+')) pos++;
            boolean isReal = false;
            while (pos < text.length()) {
                char c = text.charAt(pos);
                if (c >= '0' && c <= '9') { pos++; continue; }
                if (c == '.' || c == 'e' || c == 'E' || c == '+' || c == '-') { isReal = true; pos++; continue; }
                break;
            }
            if (pos == start) fail("expected a value");
            String token = text.substring(start, pos);
            if (!isReal) {
                try {
                    return Json.of(Long.parseLong(token));
                } catch (NumberFormatException ignored) {
                    // out of long range: fall through to double
                }
            }
            try {
                return Json.of(Double.parseDouble(token));
            } catch (NumberFormatException e) {
                throw failure("invalid number: " + token);
            }
        }
    }

    // --- comparison and printing -------------------------------------------

    /**
     * Deep equality. Integers and doubles compare numerically, so 3 equals 3.0;
     * doubles use a relative tolerance so accumulated error does not fail a test.
     */
    @Override
    public boolean equals(Object other) {
        if (this == other) return true;
        if (!(other instanceof Json)) return false;
        Json that = (Json) other;

        if (isNumber() && that.isNumber()) {
            if (type == Type.INTEGER && that.type == Type.INTEGER) return asLong() == that.asLong();
            double x = asDouble(), y = that.asDouble();
            double scale = Math.max(1.0, Math.max(Math.abs(x), Math.abs(y)));
            return Math.abs(x - y) <= 1e-9 * scale;
        }
        if (type != that.type) return false;

        switch (type) {
            case NULL: return true;
            case BOOLEAN: return asBoolean() == that.asBoolean();
            case STRING: return asString().equals(that.asString());
            case ARRAY: {
                List<Json> a = items(), b = that.items();
                if (a.size() != b.size()) return false;
                for (int i = 0; i < a.size(); i++) {
                    if (!a.get(i).equals(b.get(i))) return false;
                }
                return true;
            }
            case OBJECT: {
                Map<String, Json> a = members(), b = that.members();
                if (!a.keySet().equals(b.keySet())) return false;
                for (Map.Entry<String, Json> entry : a.entrySet()) {
                    if (!entry.getValue().equals(b.get(entry.getKey()))) return false;
                }
                return true;
            }
            default: return false;
        }
    }

    @Override
    public int hashCode() {
        // Deliberately coarse: equality is tolerant, so only the shape is hashed.
        return type == Type.INTEGER || type == Type.DOUBLE ? Type.INTEGER.hashCode() : type.hashCode();
    }

    /** Compact JSON text, used when reporting a failing test case. */
    public String dump() {
        StringBuilder out = new StringBuilder();
        write(out);
        return out.toString();
    }

    @Override
    public String toString() { return dump(); }

    private void write(StringBuilder out) {
        switch (type) {
            case NULL: out.append("null"); break;
            case BOOLEAN: out.append(asBoolean()); break;
            case INTEGER: out.append(asLong()); break;
            case DOUBLE: {
                double d = asDouble();
                if (d == Math.rint(d) && !Double.isInfinite(d)) out.append((long) d).append(".0");
                else out.append(d);
                break;
            }
            case STRING: writeString(out, asString()); break;
            case ARRAY: {
                out.append('[');
                List<Json> list = items();
                for (int i = 0; i < list.size(); i++) {
                    if (i > 0) out.append(',');
                    list.get(i).write(out);
                }
                out.append(']');
                break;
            }
            case OBJECT: {
                out.append('{');
                boolean first = true;
                for (Map.Entry<String, Json> entry : members().entrySet()) {
                    if (!first) out.append(',');
                    first = false;
                    writeString(out, entry.getKey());
                    out.append(':');
                    entry.getValue().write(out);
                }
                out.append('}');
                break;
            }
        }
    }

    private static void writeString(StringBuilder out, String value) {
        out.append('"');
        for (int i = 0; i < value.length(); i++) {
            char c = value.charAt(i);
            switch (c) {
                case '"': out.append("\\\""); break;
                case '\\': out.append("\\\\"); break;
                case '\n': out.append("\\n"); break;
                case '\r': out.append("\\r"); break;
                case '\t': out.append("\\t"); break;
                default:
                    if (c < 0x20) out.append(String.format("\\u%04x", (int) c));
                    else out.append(c);
            }
        }
        out.append('"');
    }
}
