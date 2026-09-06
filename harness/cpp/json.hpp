// Minimal JSON reader for the DSA workspace test harness.
//
// Header-only, no dependencies beyond the standard library. It exists so that
// C++ solutions can read the same tests/<problem>.json files as Python, Java
// and TypeScript. It is deliberately small: parse, inspect, compare, print.
//
// Integers are kept as int64 (not double), so large values such as fib(90) or
// 20! survive a round trip exactly.
#pragma once

#include <cmath>
#include <cstdint>
#include <cstdlib>
#include <fstream>
#include <sstream>
#include <stdexcept>
#include <string>
#include <utility>
#include <vector>

namespace dsa {

class Json {
public:
    enum class Type { Null, Bool, Int, Double, String, Array, Object };

    Json() = default;

    static Json null() { return Json(); }
    static Json boolean(bool v) { Json j; j.type_ = Type::Bool; j.bool_ = v; return j; }
    static Json integer(long long v) { Json j; j.type_ = Type::Int; j.int_ = v; return j; }
    static Json real(double v) { Json j; j.type_ = Type::Double; j.double_ = v; return j; }
    static Json string(std::string v) { Json j; j.type_ = Type::String; j.string_ = std::move(v); return j; }
    static Json array(std::vector<Json> v) { Json j; j.type_ = Type::Array; j.array_ = std::move(v); return j; }
    static Json object(std::vector<std::pair<std::string, Json>> v) {
        Json j; j.type_ = Type::Object; j.object_ = std::move(v); return j;
    }

    Type type() const { return type_; }
    bool isNull() const { return type_ == Type::Null; }
    bool isNumber() const { return type_ == Type::Int || type_ == Type::Double; }
    bool isArray() const { return type_ == Type::Array; }
    bool isObject() const { return type_ == Type::Object; }

    // Number of elements in an array or object; 0 for every other type.
    std::size_t size() const {
        if (type_ == Type::Array) return array_.size();
        if (type_ == Type::Object) return object_.size();
        return 0;
    }

    bool asBool() const {
        if (type_ != Type::Bool) throw std::runtime_error("json: expected a boolean, got " + typeName());
        return bool_;
    }

    long long asInt() const {
        if (type_ == Type::Int) return int_;
        if (type_ == Type::Double) return static_cast<long long>(double_);
        throw std::runtime_error("json: expected a number, got " + typeName());
    }

    double asDouble() const {
        if (type_ == Type::Int) return static_cast<double>(int_);
        if (type_ == Type::Double) return double_;
        throw std::runtime_error("json: expected a number, got " + typeName());
    }

    const std::string& asString() const {
        if (type_ != Type::String) throw std::runtime_error("json: expected a string, got " + typeName());
        return string_;
    }

    // Array element access.
    const Json& operator[](std::size_t index) const {
        if (type_ != Type::Array) throw std::runtime_error("json: expected an array, got " + typeName());
        if (index >= array_.size()) throw std::runtime_error("json: array index out of range");
        return array_[index];
    }

    // Object member access; throws when the key is missing (use contains() first).
    const Json& operator[](const std::string& key) const {
        if (type_ != Type::Object) throw std::runtime_error("json: expected an object, got " + typeName());
        for (const auto& entry : object_) {
            if (entry.first == key) return entry.second;
        }
        throw std::runtime_error("json: no such key: " + key);
    }

    bool contains(const std::string& key) const {
        if (type_ != Type::Object) return false;
        for (const auto& entry : object_) {
            if (entry.first == key) return true;
        }
        return false;
    }

    // Returns the member if present, otherwise null (or the given fallback).
    Json get(const std::string& key) const {
        return contains(key) ? (*this)[key] : Json();
    }

    Json get(const std::string& key, const Json& fallback) const {
        return contains(key) ? (*this)[key] : fallback;
    }

    const std::vector<Json>& items() const {
        if (type_ != Type::Array) throw std::runtime_error("json: expected an array, got " + typeName());
        return array_;
    }

    // Convenience conversions for the shapes DSA problems actually use.
    std::vector<int> ints() const {
        std::vector<int> out;
        for (const Json& item : items()) out.push_back(static_cast<int>(item.asInt()));
        return out;
    }

    std::vector<long long> longs() const {
        std::vector<long long> out;
        for (const Json& item : items()) out.push_back(item.asInt());
        return out;
    }

    std::vector<double> doubles() const {
        std::vector<double> out;
        for (const Json& item : items()) out.push_back(item.asDouble());
        return out;
    }

    std::vector<std::string> strings() const {
        std::vector<std::string> out;
        for (const Json& item : items()) out.push_back(item.asString());
        return out;
    }

    std::vector<std::vector<int>> matrix() const {
        std::vector<std::vector<int>> out;
        for (const Json& item : items()) out.push_back(item.ints());
        return out;
    }

    std::string typeName() const {
        switch (type_) {
            case Type::Null: return "null";
            case Type::Bool: return "boolean";
            case Type::Int: return "integer";
            case Type::Double: return "number";
            case Type::String: return "string";
            case Type::Array: return "array";
            case Type::Object: return "object";
        }
        return "unknown";
    }

    // Compact JSON text, used when reporting a failing test case.
    std::string dump() const {
        std::ostringstream out;
        write(out);
        return out.str();
    }

    static Json parse(const std::string& text);
    static Json parseFile(const std::string& path);

    friend bool operator==(const Json& a, const Json& b);

private:
    Type type_ = Type::Null;
    bool bool_ = false;
    long long int_ = 0;
    double double_ = 0.0;
    std::string string_;
    std::vector<Json> array_;
    std::vector<std::pair<std::string, Json>> object_;

    void write(std::ostringstream& out) const {
        switch (type_) {
            case Type::Null: out << "null"; break;
            case Type::Bool: out << (bool_ ? "true" : "false"); break;
            case Type::Int: out << int_; break;
            case Type::Double: {
                std::ostringstream num;
                num.precision(17);
                num << double_;
                out << num.str();
                break;
            }
            case Type::String: writeString(out, string_); break;
            case Type::Array: {
                out << '[';
                for (std::size_t i = 0; i < array_.size(); ++i) {
                    if (i) out << ',';
                    array_[i].write(out);
                }
                out << ']';
                break;
            }
            case Type::Object: {
                out << '{';
                for (std::size_t i = 0; i < object_.size(); ++i) {
                    if (i) out << ',';
                    writeString(out, object_[i].first);
                    out << ':';
                    object_[i].second.write(out);
                }
                out << '}';
                break;
            }
        }
    }

    static void writeString(std::ostringstream& out, const std::string& value) {
        out << '"';
        for (unsigned char c : value) {
            switch (c) {
                case '"': out << "\\\""; break;
                case '\\': out << "\\\\"; break;
                case '\n': out << "\\n"; break;
                case '\r': out << "\\r"; break;
                case '\t': out << "\\t"; break;
                default:
                    if (c < 0x20) {
                        char buf[7];
                        std::snprintf(buf, sizeof(buf), "\\u%04x", c);
                        out << buf;
                    } else {
                        out << static_cast<char>(c);
                    }
            }
        }
        out << '"';
    }
};

namespace detail {

// Recursive-descent parser over the whole input string.
class JsonParser {
public:
    explicit JsonParser(const std::string& text) : text_(text) {}

    Json parse() {
        skipWhitespace();
        Json value = parseValue();
        skipWhitespace();
        if (pos_ != text_.size()) fail("trailing characters after the top-level value");
        return value;
    }

private:
    const std::string& text_;
    std::size_t pos_ = 0;

    [[noreturn]] void fail(const std::string& message) const {
        throw std::runtime_error("json: " + message + " (at offset " + std::to_string(pos_) + ")");
    }

    void skipWhitespace() {
        while (pos_ < text_.size()) {
            char c = text_[pos_];
            if (c == ' ' || c == '\t' || c == '\n' || c == '\r') ++pos_;
            else break;
        }
    }

    char peek() const {
        if (pos_ >= text_.size()) throw std::runtime_error("json: unexpected end of input");
        return text_[pos_];
    }

    bool literal(const char* word) {
        std::size_t len = std::string(word).size();
        if (text_.compare(pos_, len, word) != 0) return false;
        pos_ += len;
        return true;
    }

    Json parseValue() {
        switch (peek()) {
            case '{': return parseObject();
            case '[': return parseArray();
            case '"': return Json::string(parseString());
            case 't': if (literal("true")) return Json::boolean(true); fail("invalid literal");
            case 'f': if (literal("false")) return Json::boolean(false); fail("invalid literal");
            case 'n': if (literal("null")) return Json::null(); fail("invalid literal");
            default: return parseNumber();
        }
    }

    Json parseObject() {
        ++pos_;  // '{'
        std::vector<std::pair<std::string, Json>> entries;
        skipWhitespace();
        if (peek() == '}') { ++pos_; return Json::object(std::move(entries)); }
        while (true) {
            skipWhitespace();
            if (peek() != '"') fail("expected a string key");
            std::string key = parseString();
            skipWhitespace();
            if (peek() != ':') fail("expected ':' after the key");
            ++pos_;
            skipWhitespace();
            entries.emplace_back(std::move(key), parseValue());
            skipWhitespace();
            char c = peek();
            if (c == ',') { ++pos_; continue; }
            if (c == '}') { ++pos_; break; }
            fail("expected ',' or '}'");
        }
        return Json::object(std::move(entries));
    }

    Json parseArray() {
        ++pos_;  // '['
        std::vector<Json> values;
        skipWhitespace();
        if (peek() == ']') { ++pos_; return Json::array(std::move(values)); }
        while (true) {
            skipWhitespace();
            values.push_back(parseValue());
            skipWhitespace();
            char c = peek();
            if (c == ',') { ++pos_; continue; }
            if (c == ']') { ++pos_; break; }
            fail("expected ',' or ']'");
        }
        return Json::array(std::move(values));
    }

    std::string parseString() {
        ++pos_;  // opening quote
        std::string out;
        while (true) {
            if (pos_ >= text_.size()) fail("unterminated string");
            char c = text_[pos_++];
            if (c == '"') break;
            if (c != '\\') { out.push_back(c); continue; }
            if (pos_ >= text_.size()) fail("unterminated escape sequence");
            char esc = text_[pos_++];
            switch (esc) {
                case '"': out.push_back('"'); break;
                case '\\': out.push_back('\\'); break;
                case '/': out.push_back('/'); break;
                case 'b': out.push_back('\b'); break;
                case 'f': out.push_back('\f'); break;
                case 'n': out.push_back('\n'); break;
                case 'r': out.push_back('\r'); break;
                case 't': out.push_back('\t'); break;
                case 'u': appendUtf8(out, parseHex4()); break;
                default: fail("unknown escape sequence");
            }
        }
        return out;
    }

    unsigned parseHex4() {
        if (pos_ + 4 > text_.size()) fail("truncated \\u escape");
        unsigned value = 0;
        for (int i = 0; i < 4; ++i) {
            char c = text_[pos_++];
            value <<= 4;
            if (c >= '0' && c <= '9') value |= static_cast<unsigned>(c - '0');
            else if (c >= 'a' && c <= 'f') value |= static_cast<unsigned>(c - 'a' + 10);
            else if (c >= 'A' && c <= 'F') value |= static_cast<unsigned>(c - 'A' + 10);
            else fail("invalid hex digit in \\u escape");
        }
        return value;
    }

    // Encodes a single code unit as UTF-8. Surrogate pairs are combined when
    // the low surrogate immediately follows.
    void appendUtf8(std::string& out, unsigned code) {
        if (code >= 0xD800 && code <= 0xDBFF && text_.compare(pos_, 2, "\\u") == 0) {
            std::size_t save = pos_;
            pos_ += 2;
            unsigned low = parseHex4();
            if (low >= 0xDC00 && low <= 0xDFFF) {
                code = 0x10000 + ((code - 0xD800) << 10) + (low - 0xDC00);
            } else {
                pos_ = save;
            }
        }
        if (code < 0x80) {
            out.push_back(static_cast<char>(code));
        } else if (code < 0x800) {
            out.push_back(static_cast<char>(0xC0 | (code >> 6)));
            out.push_back(static_cast<char>(0x80 | (code & 0x3F)));
        } else if (code < 0x10000) {
            out.push_back(static_cast<char>(0xE0 | (code >> 12)));
            out.push_back(static_cast<char>(0x80 | ((code >> 6) & 0x3F)));
            out.push_back(static_cast<char>(0x80 | (code & 0x3F)));
        } else {
            out.push_back(static_cast<char>(0xF0 | (code >> 18)));
            out.push_back(static_cast<char>(0x80 | ((code >> 12) & 0x3F)));
            out.push_back(static_cast<char>(0x80 | ((code >> 6) & 0x3F)));
            out.push_back(static_cast<char>(0x80 | (code & 0x3F)));
        }
    }

    // Integers stay integers; anything with '.', 'e' or 'E' becomes a double.
    Json parseNumber() {
        std::size_t start = pos_;
        if (pos_ < text_.size() && (text_[pos_] == '-' || text_[pos_] == '+')) ++pos_;
        bool isReal = false;
        while (pos_ < text_.size()) {
            char c = text_[pos_];
            if (c >= '0' && c <= '9') { ++pos_; continue; }
            if (c == '.' || c == 'e' || c == 'E' || c == '+' || c == '-') { isReal = true; ++pos_; continue; }
            break;
        }
        if (pos_ == start) fail("expected a value");
        std::string token = text_.substr(start, pos_ - start);
        try {
            if (isReal) return Json::real(std::stod(token));
            return Json::integer(std::stoll(token));
        } catch (const std::exception&) {
            // Out of int64 range, or otherwise unrepresentable: fall back to double.
            try {
                return Json::real(std::stod(token));
            } catch (const std::exception&) {
                fail("invalid number: " + token);
            }
        }
    }
};

}  // namespace detail

inline Json Json::parse(const std::string& text) {
    return detail::JsonParser(text).parse();
}

inline Json Json::parseFile(const std::string& path) {
    std::ifstream file(path, std::ios::binary);
    if (!file) throw std::runtime_error("json: cannot open file: " + path);
    std::ostringstream buffer;
    buffer << file.rdbuf();
    return parse(buffer.str());
}

// Deep equality. Int and Double compare numerically, so 3 == 3.0; doubles use a
// relative tolerance so accumulated floating point error does not fail a test.
inline bool operator==(const Json& a, const Json& b) {
    if (a.isNumber() && b.isNumber()) {
        if (a.type_ == Json::Type::Int && b.type_ == Json::Type::Int) return a.int_ == b.int_;
        double x = a.asDouble(), y = b.asDouble();
        double scale = std::fmax(1.0, std::fmax(std::fabs(x), std::fabs(y)));
        return std::fabs(x - y) <= 1e-9 * scale;
    }
    if (a.type_ != b.type_) return false;
    switch (a.type_) {
        case Json::Type::Null: return true;
        case Json::Type::Bool: return a.bool_ == b.bool_;
        case Json::Type::String: return a.string_ == b.string_;
        case Json::Type::Array: {
            if (a.array_.size() != b.array_.size()) return false;
            for (std::size_t i = 0; i < a.array_.size(); ++i) {
                if (!(a.array_[i] == b.array_[i])) return false;
            }
            return true;
        }
        case Json::Type::Object: {
            if (a.object_.size() != b.object_.size()) return false;
            for (const auto& entry : a.object_) {
                if (!b.contains(entry.first)) return false;
                if (!(entry.second == b[entry.first])) return false;
            }
            return true;
        }
        default: return false;
    }
}

inline bool operator!=(const Json& a, const Json& b) { return !(a == b); }

}  // namespace dsa
