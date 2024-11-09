export const LoadingState = ({ progress }) => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm w-full max-w-md">
            <div className="text-center mb-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-600 mt-4">Carregando dados do estoque...</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div
                    className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <p className="text-center text-sm text-gray-500">{progress}%</p>
        </div>
    </div>
);