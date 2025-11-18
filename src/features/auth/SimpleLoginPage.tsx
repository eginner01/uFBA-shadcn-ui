export default function SimpleLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900">
      <div className="w-full max-w-md rounded-lg bg-slate-800 p-8 shadow-xl">
        <h1 className="mb-6 text-center text-3xl font-bold text-white">
          登录页面
        </h1>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300">
              用户�?
            </label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-white placeholder-slate-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              placeholder="请输入用户名"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300">
              密码
            </label>
            <input
              type="password"
              className="mt-1 block w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-white placeholder-slate-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              placeholder="请输入密�?
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-orange-600 px-4 py-2 font-semibold text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            登录
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-400">
          测试账号：admin / 123456
        </p>
      </div>
    </div>
  );
}
