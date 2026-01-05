import {
  CircleCheck,
  Info,
  LoaderCircle,
  OctagonX,
  TriangleAlert,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheck className="h-4 w-4 text-green-500" />,
        info: <Info className="h-4 w-4 text-blue-500" />,
        warning: <TriangleAlert className="h-4 w-4 text-yellow-500" />,
        error: <OctagonX className="h-4 w-4 text-red-500" />,
        loading: (
          <LoaderCircle className="h-4 w-4 animate-spin text-gray-500" />
        ),
      }}
      toastOptions={{
        classNames: {
          toast: `
        group toast border shadow-lg backdrop-blur-md
        group-[.success]:bg-green-100 group-[.success]:text-green-900 group-[.success]:border-green-300
        group-[.error]:bg-red-100 group-[.error]:text-red-900 group-[.error]:border-red-300
        group-[.warning]:bg-yellow-100 group-[.warning]:text-yellow-900 group-[.warning]:border-yellow-300
        group-[.info]:bg-blue-100 group-[.info]:text-blue-900 group-[.info]:border-blue-300
        group-[.loading]:bg-gray-100 group-[.loading]:text-gray-900 group-[.loading]:border-gray-300
        dark:group-[.success]:bg-green-950 dark:group-[.success]:text-green-200 dark:group-[.success]:border-green-800
        dark:group-[.error]:bg-red-950 dark:group-[.error]:text-red-200 dark:group-[.error]:border-red-800
        dark:group-[.warning]:bg-yellow-950 dark:group-[.warning]:text-yellow-200 dark:group-[.warning]:border-yellow-800
        dark:group-[.info]:bg-blue-950 dark:group-[.info]:text-blue-200 dark:group-[.info]:border-blue-800
        dark:group-[.loading]:bg-gray-900 dark:group-[.loading]:text-gray-200 dark:group-[.loading]:border-gray-700
      `,
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
