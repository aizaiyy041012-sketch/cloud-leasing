// UI string dictionary for the JS-rendered product pages (products/index.html,
// products/detail.html). Product listing/spec data itself stays in one canonical
// English products.json (assets/data/products.json) — this file only carries
// translations for the surrounding UI chrome (labels, statuses, buttons, section
// titles) plus a small overlay of the human-language product fields (name,
// category, description, clusterScale) keyed by product id, so the numeric/
// technical fields (prices, part numbers, brand names) stay single-sourced and
// never drift between languages.
(function () {
  'use strict';

  var UI = {
    en: {
      specLabels: { gpu: 'GPU', cpu: 'CPU', memory: 'Memory', storage: 'Storage', network: 'Network', interconnect: 'Interconnect' },
      gpuFamilyLabel: 'GPU Family',
      gpuCount: 'GPU Count',
      clusterTotalSuffix: ' (cluster total)',
      componentItems: {
        'CPU': 'CPU', 'Motherboard': 'Motherboard', 'Memory': 'Memory', 'System Drive': 'System Drive',
        'Data Drive': 'Data Drive', 'GPU': 'GPU', 'Node NIC': 'Node NIC', 'RAID Card': 'RAID Card',
        'Power Supply': 'Power Supply', 'Chassis': 'Chassis', 'Cooling': 'Cooling', 'Rail Kit': 'Rail Kit',
        'Remote BMC Management': 'Remote BMC Management', 'GPU Power Cable Kit': 'GPU Power Cable Kit',
        'DPU': 'DPU', 'TPM Security Module': 'TPM Security Module'
      },
      deployItems: {
        'Rack & Power': 'Rack & Power', 'Network Fabric': 'Network Fabric', 'Software & Platform': 'Software & Platform',
        'Deployment & Performance Optimization': 'Deployment & Performance Optimization',
        'Documentation & Training': 'Documentation & Training', 'Enterprise Care (5-Year)': 'Enterprise Care (5-Year)',
        'Cluster Network Fabric': 'Cluster Network Fabric'
      },
      statuses: { 'Contact Sales': 'Contact Sales' },
      leasePeriods: { '8 hours': '8 hours', '16 hours': '16 hours', '24 hours': '24 hours', '180 days': '180 days' },
      returnLabels: { 'Total Return': 'Total Return', 'Daily Return': 'Daily Return', 'Return': 'Return' },
      deployTypeLabels: { Cluster: 'Cluster', Workstation: 'Workstation', 'Single GPU': 'Single GPU', 'Multi GPU': 'Multi GPU' },
      familyTitles: { RTX: 'RTX-Class Nodes', A100: 'A100-Class Nodes', H800: 'H800-Class Nodes' },
      familySuffix: 'FAMILY',
      loadingGpus: 'Loading available GPUs…',
      noGpusListed: 'No GPU nodes currently listed — check back soon.',
      unableToLoadListings: 'Unable to load GPU listings right now. Please try again shortly.',
      leaseNow: 'Lease Now',
      unnamedNode: 'Unnamed GPU Node',
      gpuNodeFallback: 'GPU Node',
      gpuServerAltSuffix: ' architecture diagram',
      viewFullSpecs: 'View Full Specifications',
      hardwareConfiguration: 'Hardware Configuration',
      estimatedDeploymentValue: 'Estimated Enterprise Deployment Value',
      deploymentValueLabel: 'Deployment Value',
      tableHeaders: { component: 'Component', brand: 'Brand', configuration: 'Configuration', price: 'Price' },
      hardwareSubtotal: 'Hardware Subtotal',
      fabricServicesSubtotal: 'Fabric / Software / Services Subtotal',
      gpuServerFallback: 'GPU Server',
      overview: 'Overview',
      bestFor: 'Best For',
      specifications: 'Specifications',
      deployment: 'Deployment',
      clusterDeployNote: 'This is a multi-node cluster deployment. Provisioning follows the enterprise deployment process — consultation, custom cluster design, and a defined support SLA. ',
      clusterDeployLink: 'Learn more about enterprise deployment →',
      singleDeployNote: 'Leasing and billing are handled directly through the Cloud Leasing platform. Deployment begins once your lease is confirmed.',
      noProductSpecified: 'No product specified. Return to the GPU Servers page to choose one.',
      loadingProduct: 'Loading product…',
      productNotFound: 'This product could not be found. It may have been renamed or removed — see the full GPU Servers list instead.',
      unableToLoadProduct: 'Unable to load product data right now. Please try again shortly.',
      bestForText: {
        RTX: 'RTX-class nodes are best suited for teams fine-tuning models, running small-scale training jobs, and serving inference workloads that don’t require multi-node scale.',
        A100: 'A100-class nodes are best suited for production teams running large-scale model training and high-throughput inference, including multi-GPU distributed workloads.',
        H800: 'H800-class nodes are best suited for organizations training the largest models and running multimodal inference across bare-metal, multi-node clusters.'
      }
    },

    'zh-CN': {
      specLabels: { gpu: 'GPU', cpu: 'CPU', memory: '内存', storage: '存储', network: '网络', interconnect: '互联' },
      gpuFamilyLabel: 'GPU 系列',
      gpuCount: 'GPU 数量',
      clusterTotalSuffix: '（集群总计）',
      componentItems: {
        'CPU': 'CPU', 'Motherboard': '主板', 'Memory': '内存', 'System Drive': '系统盘',
        'Data Drive': '数据盘', 'GPU': 'GPU', 'Node NIC': '节点网卡', 'RAID Card': 'RAID 卡',
        'Power Supply': '电源', 'Chassis': '机箱', 'Cooling': '散热模块', 'Rail Kit': '导轨套件',
        'Remote BMC Management': '远程 BMC 管理', 'GPU Power Cable Kit': 'GPU 供电线材套件',
        'DPU': 'DPU', 'TPM Security Module': 'TPM 安全模块'
      },
      deployItems: {
        'Rack & Power': '机架与供电', 'Network Fabric': '网络架构', 'Software & Platform': '软件与平台',
        'Deployment & Performance Optimization': '部署与性能调优',
        'Documentation & Training': '交付文档与培训', 'Enterprise Care (5-Year)': '企业级保修服务（5年）',
        'Cluster Network Fabric': '集群网络架构'
      },
      statuses: { 'Contact Sales': '联系销售' },
      leasePeriods: { '8 hours': '8 小时', '16 hours': '16 小时', '24 hours': '24 小时', '180 days': '180 天' },
      returnLabels: { 'Total Return': '总回报', 'Daily Return': '日回报', 'Return': '回报' },
      deployTypeLabels: { Cluster: '集群', Workstation: '工作站', 'Single GPU': '单 GPU', 'Multi GPU': '多 GPU' },
      familyTitles: { RTX: 'RTX 系列节点', A100: 'A100 系列节点', H800: 'H800 系列节点' },
      familySuffix: '系列',
      loadingGpus: '正在加载可用 GPU…',
      noGpusListed: '暂无可用 GPU 节点，请稍后再来查看。',
      unableToLoadListings: '暂时无法加载 GPU 列表，请稍后重试。',
      leaseNow: '立即租赁',
      unnamedNode: '未命名 GPU 节点',
      gpuNodeFallback: 'GPU 节点',
      gpuServerAltSuffix: ' 架构示意图',
      viewFullSpecs: '查看完整规格',
      hardwareConfiguration: '硬件配置',
      estimatedDeploymentValue: '预估企业级部署价值',
      deploymentValueLabel: '部署价值',
      tableHeaders: { component: '组件', brand: '品牌', configuration: '配置', price: '价格' },
      hardwareSubtotal: '硬件小计',
      fabricServicesSubtotal: '网络架构 / 软件 / 服务小计',
      gpuServerFallback: 'GPU 服务器',
      overview: '概览',
      bestFor: '适用场景',
      specifications: '规格参数',
      deployment: '部署方式',
      clusterDeployNote: '这是一个多节点集群部署方案。开通流程遵循企业级部署流程——需求评估、定制集群设计，并配有明确的服务等级协议（SLA）。',
      clusterDeployLink: '了解企业级部署详情 →',
      singleDeployNote: '租赁与计费直接通过 Cloud Leasing 平台处理。租赁确认后即可开始部署。',
      noProductSpecified: '未指定产品，请返回 GPU 服务器页面重新选择。',
      loadingProduct: '正在加载产品信息…',
      productNotFound: '未找到该产品，可能已更名或下架——请查看完整的 GPU 服务器列表。',
      unableToLoadProduct: '暂时无法加载产品数据，请稍后重试。',
      bestForText: {
        RTX: 'RTX 系列节点最适合需要模型微调、小规模训练以及无需多节点规模的推理任务的团队。',
        A100: 'A100 系列节点最适合运行大规模模型训练与高吞吐推理（包括多 GPU 分布式任务）的生产团队。',
        H800: 'H800 系列节点最适合训练超大规模模型、并在裸金属多节点集群上运行多模态推理的组织。'
      }
    },

    ja: {
      specLabels: { gpu: 'GPU', cpu: 'CPU', memory: 'メモリ', storage: 'ストレージ', network: 'ネットワーク', interconnect: 'インターコネクト' },
      gpuFamilyLabel: 'GPU ファミリー',
      gpuCount: 'GPU 数',
      clusterTotalSuffix: '（クラスター合計）',
      componentItems: {
        'CPU': 'CPU', 'Motherboard': 'マザーボード', 'Memory': 'メモリ', 'System Drive': 'システムドライブ',
        'Data Drive': 'データドライブ', 'GPU': 'GPU', 'Node NIC': 'ノード NIC', 'RAID Card': 'RAID カード',
        'Power Supply': '電源ユニット', 'Chassis': 'シャーシ', 'Cooling': '冷却モジュール', 'Rail Kit': 'レールキット',
        'Remote BMC Management': 'リモート BMC 管理', 'GPU Power Cable Kit': 'GPU 電源ケーブルキット',
        'DPU': 'DPU', 'TPM Security Module': 'TPM セキュリティモジュール'
      },
      deployItems: {
        'Rack & Power': 'ラック＆電源', 'Network Fabric': 'ネットワークファブリック', 'Software & Platform': 'ソフトウェア＆プラットフォーム',
        'Deployment & Performance Optimization': '導入・パフォーマンス最適化',
        'Documentation & Training': '納品ドキュメント＆トレーニング', 'Enterprise Care (5-Year)': 'エンタープライズ保守（5年間）',
        'Cluster Network Fabric': 'クラスターネットワークファブリック'
      },
      statuses: { 'Contact Sales': 'お問い合わせ' },
      leasePeriods: { '8 hours': '8時間', '16 hours': '16時間', '24 hours': '24時間', '180 days': '180日' },
      returnLabels: { 'Total Return': '総リターン', 'Daily Return': '日次リターン', 'Return': 'リターン' },
      deployTypeLabels: { Cluster: 'クラスター', Workstation: 'ワークステーション', 'Single GPU': 'シングル GPU', 'Multi GPU': 'マルチ GPU' },
      familyTitles: { RTX: 'RTX クラスノード', A100: 'A100 クラスノード', H800: 'H800 クラスノード' },
      familySuffix: 'ファミリー',
      loadingGpus: '利用可能な GPU を読み込み中…',
      noGpusListed: '現在掲載中の GPU ノードはありません。後ほど改めてご確認ください。',
      unableToLoadListings: 'GPU 一覧を読み込めませんでした。しばらくしてから再度お試しください。',
      leaseNow: '今すぐ借りる',
      unnamedNode: '名称未設定の GPU ノード',
      gpuNodeFallback: 'GPU ノード',
      gpuServerAltSuffix: ' アーキテクチャ図',
      viewFullSpecs: '詳細スペックを見る',
      hardwareConfiguration: 'ハードウェア構成',
      estimatedDeploymentValue: '推定エンタープライズ導入価値',
      deploymentValueLabel: '導入価値',
      tableHeaders: { component: 'コンポーネント', brand: 'ブランド', configuration: '構成', price: '価格' },
      hardwareSubtotal: 'ハードウェア小計',
      fabricServicesSubtotal: 'ネットワーク / ソフトウェア / サービス小計',
      gpuServerFallback: 'GPU サーバー',
      overview: '概要',
      bestFor: '最適な用途',
      specifications: '仕様',
      deployment: '導入方式',
      clusterDeployNote: 'これはマルチノードのクラスター導入です。エンタープライズ導入プロセス（要件ヒアリング、カスタムクラスター設計、明確な SLA の設定）に沿って進めます。',
      clusterDeployLink: 'エンタープライズ導入について詳しく見る →',
      singleDeployNote: 'リースおよび請求は Cloud Leasing プラットフォーム上で直接処理されます。リース確定後、導入が開始されます。',
      noProductSpecified: '製品が指定されていません。GPU サーバー一覧ページから選択してください。',
      loadingProduct: '製品情報を読み込み中…',
      productNotFound: 'この製品は見つかりませんでした。名称変更または掲載終了の可能性があります —— GPU サーバー一覧をご確認ください。',
      unableToLoadProduct: '製品データを読み込めませんでした。しばらくしてから再度お試しください。',
      bestForText: {
        RTX: 'RTX クラスノードは、モデルのファインチューニング、小規模トレーニング、マルチノード規模を必要としない推論ワークロードに取り組むチームに最適です。',
        A100: 'A100 クラスノードは、大規模モデルトレーニングや高スループット推論（マルチ GPU 分散処理を含む）を運用する本番チームに最適です。',
        H800: 'H800 クラスノードは、最大規模のモデルをトレーニングし、ベアメタルのマルチノードクラスターでマルチモーダル推論を実行する組織に最適です。'
      }
    },

    ko: {
      specLabels: { gpu: 'GPU', cpu: 'CPU', memory: '메모리', storage: '스토리지', network: '네트워크', interconnect: '인터커넥트' },
      gpuFamilyLabel: 'GPU 제품군',
      gpuCount: 'GPU 개수',
      clusterTotalSuffix: '（클러스터 총합）',
      componentItems: {
        'CPU': 'CPU', 'Motherboard': '메인보드', 'Memory': '메모리', 'System Drive': '시스템 드라이브',
        'Data Drive': '데이터 드라이브', 'GPU': 'GPU', 'Node NIC': '노드 NIC', 'RAID Card': 'RAID 카드',
        'Power Supply': '파워 서플라이', 'Chassis': '섀시', 'Cooling': '쿨링 모듈', 'Rail Kit': '레일 키트',
        'Remote BMC Management': '원격 BMC 관리', 'GPU Power Cable Kit': 'GPU 전원 케이블 키트',
        'DPU': 'DPU', 'TPM Security Module': 'TPM 보안 모듈'
      },
      deployItems: {
        'Rack & Power': '랙 및 전원', 'Network Fabric': '네트워크 패브릭', 'Software & Platform': '소프트웨어 및 플랫폼',
        'Deployment & Performance Optimization': '배포 및 성능 최적화',
        'Documentation & Training': '납품 문서 및 교육', 'Enterprise Care (5-Year)': '엔터프라이즈 케어（5년）',
        'Cluster Network Fabric': '클러스터 네트워크 패브릭'
      },
      statuses: { 'Contact Sales': '영업팀 문의' },
      leasePeriods: { '8 hours': '8시간', '16 hours': '16시간', '24 hours': '24시간', '180 days': '180일' },
      returnLabels: { 'Total Return': '총 수익', 'Daily Return': '일일 수익', 'Return': '수익' },
      deployTypeLabels: { Cluster: '클러스터', Workstation: '워크스테이션', 'Single GPU': '싱글 GPU', 'Multi GPU': '멀티 GPU' },
      familyTitles: { RTX: 'RTX 클래스 노드', A100: 'A100 클래스 노드', H800: 'H800 클래스 노드' },
      familySuffix: '패밀리',
      loadingGpus: '사용 가능한 GPU를 불러오는 중…',
      noGpusListed: '현재 등록된 GPU 노드가 없습니다. 나중에 다시 확인해 주세요.',
      unableToLoadListings: 'GPU 목록을 불러올 수 없습니다. 잠시 후 다시 시도해 주세요.',
      leaseNow: '지금 임대하기',
      unnamedNode: '이름 없는 GPU 노드',
      gpuNodeFallback: 'GPU 노드',
      gpuServerAltSuffix: ' 아키텍처 다이어그램',
      viewFullSpecs: '전체 사양 보기',
      hardwareConfiguration: '하드웨어 구성',
      estimatedDeploymentValue: '예상 엔터프라이즈 배포 가치',
      deploymentValueLabel: '배포 가치',
      tableHeaders: { component: '구성 요소', brand: '브랜드', configuration: '구성', price: '가격' },
      hardwareSubtotal: '하드웨어 소계',
      fabricServicesSubtotal: '네트워크 / 소프트웨어 / 서비스 소계',
      gpuServerFallback: 'GPU 서버',
      overview: '개요',
      bestFor: '적합한 용도',
      specifications: '사양',
      deployment: '배포 방식',
      clusterDeployNote: '이는 멀티 노드 클러스터 배포입니다. 프로비저닝은 상담, 맞춤형 클러스터 설계, 명확한 SLA 설정을 포함한 엔터프라이즈 배포 프로세스를 따릅니다.',
      clusterDeployLink: '엔터프라이즈 배포에 대해 자세히 보기 →',
      singleDeployNote: '임대 및 청구는 Cloud Leasing 플랫폼에서 직접 처리됩니다. 임대가 확정되면 배포가 시작됩니다.',
      noProductSpecified: '지정된 제품이 없습니다. GPU 서버 페이지로 돌아가 제품을 선택해 주세요.',
      loadingProduct: '제품 정보를 불러오는 중…',
      productNotFound: '해당 제품을 찾을 수 없습니다. 이름이 변경되었거나 제거되었을 수 있습니다 — 전체 GPU 서버 목록을 확인해 주세요.',
      unableToLoadProduct: '제품 데이터를 불러올 수 없습니다. 잠시 후 다시 시도해 주세요.',
      bestForText: {
        RTX: 'RTX 클래스 노드는 모델 파인튜닝, 소규모 학습, 멀티 노드 규모가 필요하지 않은 추론 작업을 수행하는 팀에 가장 적합합니다.',
        A100: 'A100 클래스 노드는 대규모 모델 학습과 고처리량 추론(멀티 GPU 분산 작업 포함)을 운영하는 프로덕션 팀에 가장 적합합니다.',
        H800: 'H800 클래스 노드는 최대 규모의 모델을 학습하고 베어메탈 멀티 노드 클러스터에서 멀티모달 추론을 실행하는 조직에 가장 적합합니다.'
      }
    }
  };

  window.CloudLeasingUI = UI[(window.CloudLeasingI18n && window.CloudLeasingI18n.locale) || 'en'] || UI.en;
})();
