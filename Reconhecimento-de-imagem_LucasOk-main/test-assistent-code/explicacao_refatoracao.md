# Explicação Linha a Linha do Código refatoracao.py

## Função `c(l)`

```python
def c(l):
    t=0
    for i in range(len(l)):
        t=t+l[i]
    m=t/len(l)
    mx=l[0]
    mn=l[0]
    for i in range(len(l)):
        if l[i]>mx:
            mx=l[i]
        if l[i]<mn:
            mn=l[i]
    return t,m,mx,mn
```

- **`def c(l):`** — Define a função `c` que recebe uma lista `l` como parâmetro.
- **`t=0`** — Inicializa a variável `t` (total) com zero.
- **`for i in range(len(l)):`** — Loop para percorrer todos os índices da lista `l`.
- **`t=t+l[i]`** — Soma cada elemento da lista ao total `t`.
- **`m=t/len(l)`** — Calcula a média dos elementos da lista, dividindo o total pelo número de elementos.
- **`mx=l[0]`** — Inicializa a variável `mx` (maior valor) com o primeiro elemento da lista.
- **`mn=l[0]`** — Inicializa a variável `mn` (menor valor) com o primeiro elemento da lista.
- **`for i in range(len(l)):`** — Segundo loop para percorrer todos os índices da lista.
- **`if l[i]>mx:`** — Se o elemento atual for maior que o valor em `mx`, atualiza `mx`.
- **`mx=l[i]`** — Atualiza o maior valor encontrado.
- **`if l[i]<mn:`** — Se o elemento atual for menor que o valor em `mn`, atualiza `mn`.
- **`mn=l[i]`** — Atualiza o menor valor encontrado.
- **`return t,m,mx,mn`** — Retorna uma tupla com o total, a média, o maior e o menor valor da lista.

---

## Execução do Código

```python
x=[23,7,45,2,67,12,89,34,56,11]
a,b,c2,d=c(x)
print("total:",a)
print("media:",b)
print("maior:",c2)
print("menor:",d)
```

- **`x=[23,7,45,2,67,12,89,34,56,11]`** — Cria uma lista de números inteiros.
- **`a,b,c2,d=c(x)`** — Chama a função `c` passando a lista `x` e armazena os resultados nas variáveis `a` (total), `b` (média), `c2` (maior valor) e `d` (menor valor).
- **`print("total:",a)`** — Imprime o total dos valores da lista.
- **`print("media:",b)`** — Imprime a média dos valores da lista.
- **`print("maior:",c2)`** — Imprime o maior valor da lista.
- **`print("menor:",d)`** — Imprime o menor valor da lista.

---

## Saída Esperada

```
total: 346
media: 34.6
maior: 89
menor: 2
```
