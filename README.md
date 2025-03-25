# ArmaTuJubilación

Una aplicación web interactiva para planificar tu retiro de forma personalizada.

## Descripción

ArmaTuJubilación permite a los usuarios calcular y visualizar cómo crecerá su capital durante la fase de acumulación (años de aporte) y cómo se agotará durante la fase de decumulación (retiro). La aplicación utiliza fórmulas financieras estándar para proporcionar estimaciones precisas basadas en los datos ingresados por el usuario.

## Funcionalidades

- **Cálculo de Acumulación**: Calcula el monto final acumulado en base a un monto inicial, aportes mensuales, tasa de rendimiento y años de aporte.
- **Cálculo de Decumulación**: Permite calcular:
  - El monto anual de retiro posible para una duración específica de retiro.
  - La duración estimada del retiro para un monto de retiro anual fijo.
- **Visualización Gráfica**: Muestra la evolución del capital a lo largo del tiempo, tanto en la fase de acumulación como en la de decumulación.
- **Diseño Responsivo**: Funciona en dispositivos móviles, tablets y ordenadores.

## Tecnologías Utilizadas

- HTML5
- CSS3
- JavaScript (Vanilla)
- Chart.js (para gráficos)
- Font Awesome (para íconos)

## Fórmulas Utilizadas

### Acumulación
El monto final acumulado (FV) se calcula utilizando la fórmula de valor futuro para una inversión con aportes periódicos:

```
FV = PV × (1 + r)ⁿ + PMT × [(1 + r)ⁿ - 1] / r
```

Donde:
- `PV` = monto inicial
- `PMT` = aporte anual (aporte mensual × 12)
- `r` = tasa real anual (como decimal)
- `n` = años de aporte

### Decumulación
El retiro anual posible (W) se calcula con la fórmula de anualidad:

```
W = FV × [r(1 + r)ⁿ / ((1 + r)ⁿ - 1)]
```

Alternativamente, la duración del retiro (n) con un monto fijo (W) se calcula así:

```
n = -ln(1 - r×FV/W) / ln(1 + r)
```

## Cómo Utilizar

1. Abre el archivo `index.html` en cualquier navegador moderno.
2. Ingresa los datos solicitados:
   - Monto inicial acumulado
   - Años de aporte
   - Aporte mensual adicional
   - Tasa real anual (%)
3. Selecciona el tipo de cálculo:
   - Calcular monto de retiro (con duración fija)
   - Calcular duración (con monto de retiro fijo)
4. Los resultados se actualizarán automáticamente, mostrando el monto final acumulado y el retiro anual posible o la duración del retiro, según corresponda.
5. Observa el gráfico para visualizar la evolución de tu capital a lo largo del tiempo.

## Consideraciones Importantes

- La aplicación utiliza una tasa real anual, que es la tasa nominal ajustada por inflación.
- Los cálculos son estimaciones basadas en las fórmulas financieras estándar y no garantizan resultados futuros.
- La aplicación es únicamente para fines educativos e informativos, no constituye asesoramiento financiero profesional.

## Licencia

Este proyecto está disponible como software de código abierto bajo los términos de la licencia MIT. 