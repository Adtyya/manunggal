export default function LoadingIcon({ width = 24, height = 24 }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 200 200"
        >
            <circle fill="#C4C4C4" stroke="#C4C4C4" strokeWidth="15" r="15" cx="40" cy="100">
                <animate attributeName="opacity" calcMode="spline" dur="2" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4" />
            </circle>
            <circle fill="#C4C4C4" stroke="#C4C4C4" strokeWidth="15" r="15" cx="100" cy="100">
                <animate attributeName="opacity" calcMode="spline" dur="2" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2" />
            </circle>
            <circle fill="#C4C4C4" stroke="#C4C4C4" strokeWidth="15" r="15" cx="160" cy="100">
                <animate attributeName="opacity" calcMode="spline" dur="2" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0" />
            </circle>
        </svg>
    );
}