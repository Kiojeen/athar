const config = {
  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],

  importOrder: [
    "^react$",
    "^next$",
    "<THIRD_PARTY_MODULES>",
    "",
    "^@/pages/(.*)$",
    "",
    "^@/lib/(.*)$",
    "^@/hooks/(.*)$",
    "^@/i18n/(.*)$",
    "^@/components/ui/(.*)$",
    "^@/components/(.*)$",
    "^@/features/(.*)$",
    "^@/server/(.*)$",
    "^@/styles/(.*)$",
    "^@/trpc/(.*)$",
    "^@/app/(.*)$",
    "",
    "^[./]",
  ],

  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderSortSpecifiers: true,

  tailwindFunctions: ["clsx", "cn", "tw", "twMerge", "cva"],

  trailingComma: "all",
  singleQuote: false,
  semi: true,
};

export default config;
