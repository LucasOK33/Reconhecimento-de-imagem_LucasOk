# Depuração do código debug.py

Abaixo estão os erros encontrados no código e suas respectivas correções:

---

## 1. Erro de Sintaxe na Entrada do Preço do Item 1

**Linha original:**
```python
item1 = float(input(Preço do item 1? ))
```
- **Problema:** Falta de aspas na string do prompt.
- **Correção:**
```python
item1 = float(input("Preço do item 1? "))
```

---

## 2. Conversão de Tipo para o Cupom de Desconto

**Linha original:**
```python
desconto_cupom = (input("Você tem um cupom de desconto? (Digite o percentual ou 0): "))
desconto = subtotal * (desconto_cupom / 100)
```
- **Problema:** O valor retornado por `input` é uma string, mas está sendo usado como número na operação matemática.
- **Correção:**
```python
desconto_cupom = float(input("Você tem um cupom de desconto? (Digite o percentual ou 0): "))
desconto = subtotal * (desconto_cupom / 100)
```

---

## 3. Impressão do Item 2

**Linha original:**
```python
print(" Item 2:        R$ {total_item2:.2f}")
```
- **Problema:** Não está usando f-string, então não exibe o valor da variável.
- **Correção:**
```python
print(f" Item 2:        R$ {total_item2:.2f}")
```

---

## 4. Indentação no Bloco do Desconto

**Linha original:**
```python
if desconto_cupom > 0: 
print(f" Desconto ({desconto_cupom:.0f}%): -R$ {desconto:.2f}")
```
- **Problema:** O print está fora do bloco do if devido à falta de indentação.
- **Correção:**
```python
if desconto_cupom > 0:
    print(f" Desconto ({desconto_cupom:.0f}%): -R$ {desconto:.2f}")
```

---

## 5. Observação sobre Tipos
- Após a conversão de `desconto_cupom` para float, a comparação `if desconto_cupom > 0:` funciona corretamente.

---

## Código Corrigido (Resumo das Mudanças)

```python
cliente = input("Qual é seu nome? ")

qtd1 = int(input("Quantidade do item 1: "))
item1 = float(input("Preço do item 1? "))

qtd2 = int(input("Quantidade do item 2: "))
item2 = float(input("Preço do item 2? "))

qtd3 = int(input("Quantidade do item 3: "))
item3 = float(input("Preço do item 3? "))

# CÁLCULOS DOS ITENS
total_item1 = qtd1 * item1
total_item2 = qtd2 * item2
total_item3 = qtd3 * item3

subtotal = total_item1 + total_item2 + total_item3
imposto = subtotal * 0.10

desconto_cupom = float(input("Você tem um cupom de desconto? (Digite o percentual ou 0): "))
desconto = subtotal * (desconto_cupom / 100)

total = subtotal + imposto - desconto

linha = "=" * 31
separador = "-" * 31

print(linha)
print(f" Cliente: {cliente}")
print(linha)
print(f" Item 1:        R$ {total_item1:.2f}")
print(f" Item 2:        R$ {total_item2:.2f}")
print(f" Item 3:        R$ {total_item3:.2f}")
print(separador)
print(f" Subtotal:      R$ {subtotal:.2f}")
print(f" Imposto (10%): R$ {imposto:.2f}")

if desconto_cupom > 0:
    print(f" Desconto ({desconto_cupom:.0f}%): -R$ {desconto:.2f}")

print(linha)
print(f" TOTAL:         R$ {round(total, 2):.2f}")
print(linha)
```
