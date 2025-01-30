# Dynamic Global Wallet Examples

A collection of example implementations showcasing Dynamic Global Wallet integration across different frameworks and platforms.

## 🌟 Overview

This repository demonstrates how to integrate Dynamic Global Wallet in various dApp environments. It contains:

- A core Dynamic Global Wallet package (`packages/dynamic-global-wallet`)
- Multiple example dApps showcasing different integration approaches (`examples/`)

> 📘 **Looking to create your own Dynamic Global Wallet package?**
> Check out the official [Dynamic documentation](https://docs.dynamic.xyz/).

## 🏗️ Project Structure

### Core Package

The main Dynamic Global Wallet configuration is located at:

```
packages/dynamic-global-wallet/package.json

packages/dynamic-global-wallet/src/lib/config.ts
```

### Integration

To integrate the Dynamic Global Wallet in your project, simply add these two lines to your `main.ts`:

```typescript
import "<your-package-name>/eip6963";
import "<your-package-name>/solana-standard";
```

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or higher
- pnpm package manager

### Installation

1. Install dependencies:

```bash
pnpm install
```

2. Build the Dynamic Global Wallet package:

```bash
pnpm build-dynamic-global-wallet
```

## 🔍 Example Applications

Run any of the following examples to see Dynamic Global Wallet in action:

### Next.js Implementation

```bash
pnpm dynamic-nextjs
```

### Vite Implementation

```bash
pnpm dynamic-vite
```

### SDK-specific Examples

- **RainbowKit:**

  ```bash
  pnpm rainbowkit-vite
  ```

- **Privy:**

  ```bash
  pnpm privy-vite
  ```

- **ConnectKit:**
  ```bash
  pnpm connectkit-vite
  ```
