"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {

    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div>
            <h2>Something went wrong!</h2>
            <p>We&apos;re looking into it.</p>
            {error.digest && <p>Reference: {error.digest}</p>}
            <button onClick={() => reset()}>Try again</button>
        </div>
    )
}
