# Explicação Linha a Linha do Código

## Função `verificar_primo(n)`

```python
def verificar_primo(n):
    """Verifica se um número é primo."""
```

- **`def verificar_primo(n):`** - Define uma função chamada `verificar_primo` que recebe um parâmetro `n` (o número a ser verificado)
- **`"""Verifica se um número é primo."""`** - Docstring que descreve o propósito da função

---

```python
    if n < 2:
        return False
```

- **`if n < 2:`** - Verifica se o número é menor que 2
- **`return False`** - Números menores que 2 (0 e 1) não são primos, então retorna `False`

---

```python
    if n == 2:
        return True
```

- **`if n == 2:`** - Verifica se o número é exatamente 2
- **`return True`** - 2 é o único número primo par, então retorna `True`

---

```python
    if n % 2 == 0:
        return False
```

- **`if n % 2 == 0:`** - Verifica se o número é divisível por 2 (é par)
- **`return False`** - Qualquer número par maior que 2 não é primo, então retorna `False`

---

```python
    for i in range(3, int(n**0.5) + 1, 2):
        if n % i == 0:
            return False
    return True
```

- **`for i in range(3, int(n**0.5) + 1, 2):`** - Loop que percorre números ímpares de 3 até a raiz quadrada de `n`
  - `range(3, int(n**0.5) + 1, 2)` - Gera: 3, 5, 7, 9, ... até √n
  - Usar apenas números ímpares otimiza o algoritmo (já eliminamos os pares)
  
- **`if n % i == 0:`** - Verifica se `n` é divisível pelo número atual `i`
- **`return False`** - Se encontrar um divisor, o número não é primo

- **`return True`** - Se o loop terminar sem encontrar divisores, o número é primo

---

## Bloco de Testes

```python
if __name__ == "__main__":
    numeros = [1, 2, 3, 4, 5, 17, 18, 19, 20, 23]
    for num in numeros:
        resultado = "primo" if verificar_primo(num) else "não primo"
        print(f"{num} é {resultado}")
```

- **`if __name__ == "__main__":`** - Garante que o código abaixo só execute quando o arquivo for rodado diretamente (não quando importado como módulo)

- **`numeros = [1, 2, 3, 4, 5, 17, 18, 19, 20, 23]`** - Lista de números para testar

- **`for num in numeros:`** - Loop que percorre cada número da lista

- **`resultado = "primo" if verificar_primo(num) else "não primo"`** - Expressão ternária que define o resultado com base na função

- **`print(f"{num} é {resultado}")`** - Imprime o resultado formatado

---

## Saída Esperada

```
1 é não primo
2 é primo
3 é primo
4 é não primo
5 é primo
17 é primo
18 é não primo
19 é primo
20 é não primo
23 é primo
```