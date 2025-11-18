import ManagementPageTemplate from '@/components/ManagementPageTemplate';

export default function NoticeManagementPage() {
  return (
    <ManagementPageTemplate
      title="通知公告"
      description="系统通知公告管理"
      onRefresh={() => console.log('刷新')}
      onAdd={() => console.log('新增公告')}
    >
      <p className="text-gray-400 text-center py-8">通知公告功能开发中...</p>
    </ManagementPageTemplate>
  );
}
