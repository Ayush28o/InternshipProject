"""
Task 01: Temperature Converter
Converts temperatures between Celsius, Fahrenheit, and Kelvin.
"""


def celsius_to_fahrenheit(c):
    return (c * 9 / 5) + 32


def celsius_to_kelvin(c):
    return c + 273.15


def fahrenheit_to_celsius(f):
    return (f - 32) * 5 / 9


def fahrenheit_to_kelvin(f):
    return celsius_to_kelvin(fahrenheit_to_celsius(f))


def kelvin_to_celsius(k):
    return k - 273.15


def kelvin_to_fahrenheit(k):
    return celsius_to_fahrenheit(kelvin_to_celsius(k))


def convert(value, from_scale, to_scale):
    from_scale = from_scale.upper()
    to_scale = to_scale.upper()

    if from_scale == to_scale:
        return value

    # Convert everything to Celsius first, then to the target scale.
    if from_scale == "F":
        celsius = fahrenheit_to_celsius(value)
    elif from_scale == "K":
        celsius = kelvin_to_celsius(value)
    elif from_scale == "C":
        celsius = value
    else:
        raise ValueError("Unknown scale: use C, F, or K")

    if to_scale == "C":
        return celsius
    elif to_scale == "F":
        return celsius_to_fahrenheit(celsius)
    elif to_scale == "K":
        return celsius_to_kelvin(celsius)
    else:
        raise ValueError("Unknown scale: use C, F, or K")


def main():
    print("=== Temperature Converter ===")
    print("Scales: C = Celsius, F = Fahrenheit, K = Kelvin")

    while True:
        try:
            value = float(input("\nEnter temperature value: "))
            from_scale = input("Convert FROM (C/F/K): ").strip()
            to_scale = input("Convert TO (C/F/K): ").strip()

            result = convert(value, from_scale, to_scale)
            print(f"{value}°{from_scale.upper()} = {result:.2f}°{to_scale.upper()}")

        except ValueError as e:
            print(f"Error: {e}. Please enter a valid number and scale.")

        again = input("\nConvert another? (y/n): ").strip().lower()
        if again != "y":
            print("Goodbye!")
            break


if __name__ == "__main__":
    main()