export default {
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

  tailwindFunctions: ["clsx", "cn", "tw", "twMerge", "cva"],

  trailingComma: "all",
  singleQuote: false,
  semi: true,
};
