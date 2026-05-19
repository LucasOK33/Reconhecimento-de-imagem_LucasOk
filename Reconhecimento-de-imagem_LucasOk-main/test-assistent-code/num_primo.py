def verificar_primo(n):
    """Verifica se um número é primo."""
    if n < 2:
        return False
    if n == 2:
        return True
    if n % 2 == 0:
        return False
    
    for i in range(3, int(n**0.5) + 1, 2):
        if n % i == 0:
            return False
    return True


# Testes
if __name__ == "__main__":
    numeros = [1, 2, 3, 4, 5, 17, 18, 19, 20, 23]
    for num in numeros:
        resultado = "primo" if verificar_primo(num) else "não primo"
        print(f"{num} é {resultado}")